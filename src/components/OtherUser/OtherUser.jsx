import React, { useEffect, useState } from 'react';
import './OtherUser.css';
import TopBar from '../Navigation/TopBar';
import { useParams } from 'react-router-dom';
import {
  doc, getDoc, collection, getDocs, query, orderBy, updateDoc,
  deleteDoc, addDoc, where
} from 'firebase/firestore';
import { db } from '../../firebase';
import PostUser from '../PostUser/PostUser';
import { ProfileHeader } from '../ProfileHeader/ProfileHeader';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';

const OtherUser = () => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const { userId } = useParams();

  const forbiddenWords = [
    "puta", "idiota", "maldito", "asqueroso", "estúpido", "mierda", "imbécil"
  ];

  const containsForbiddenWords = (text) => {
    return forbiddenWords.some((word) => text.toLowerCase().includes(word));
  };

  // Listen for Auth changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data
  const fetchUserData = async () => {
    if (!userId) return;
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() };
      setUserData(data);
      getUserPosts(docSnap.id);
    }
  };

  // Refresh method to pass down
  const refreshUser = () => {
    fetchUserData();
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Fetch posts
  const getUserPosts = async (uid) => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const userPosts = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((post) => post.userId === uid);
    setPosts(userPosts);
  };

  // Edit post
  const handleEdit = (postId, currentText) => {
    setEditingPostId(postId);
    setEditedText(currentText);
  };

  // Save post edit
  const handleSave = async (postId) => {
    if (containsForbiddenWords(editedText)) {
      Swal.fire("⚠️", "No se permite lenguaje ofensivo en la edición del post", "error");
      return;
    }
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { text: editedText });
    setEditingPostId(null);
    setEditedText('');
    getUserPosts(userData.id);
  };

  // Delete post
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('¿Seguro que quieres borrar este post?');
    if (!confirmDelete) return;
    await deleteDoc(doc(db, 'posts', postId));
    getUserPosts(userData.id);
  };

  // Edit text change handler
  const handleChangeEdit = (e) => {
    setEditedText(e.target.value);
  };

  // Report user
  const handleReportUser = async () => {
    const currentUser = JSON.parse(sessionStorage.getItem("userData"));
    if (!currentUser) return;

    const existingQuery = query(
      collection(db, "reports"),
      where("reportedUserId", "==", userId),
      where("reportedBy", "==", currentUser.uid)
    );
    const existingReports = await getDocs(existingQuery);

    if (!existingReports.empty) {
      Swal.fire("Ya reportaste este perfil", "Solo se permite un reporte por usuario.", "info");
      return;
    }

    const { value: reason } = await Swal.fire({
      title: "¿Por qué deseas reportar este perfil?",
      input: "text",
      inputPlaceholder: "Escribe tu motivo...",
      showCancelButton: true,
      confirmButtonText: "Reportar",
      cancelButtonText: "Cancelar"
    });

    if (!reason) return;

    try {
      await addDoc(collection(db, "reports"), {
        reportedUserId: userId,
        reportedBy: currentUser.uid,
        reportedAt: new Date(),
        reason: reason,
      });

      Swal.fire("✅ Reportado", "El perfil fue reportado con éxito.", "success");
    } catch (err) {
      console.error("Error al reportar perfil:", err);
      Swal.fire("❌ Error", "Hubo un problema al reportar el perfil.", "error");
    }
  };

  return (
    <>
      <TopBar />
      <div className="mypost-container">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <button onClick={handleReportUser} className="report-btn">
            🚷 Reportar perfil
          </button>
        </div>

        {userData && currentUserId && (
          <ProfileHeader
            userData={userData}
            currentUserId={currentUserId}
            refreshUser={refreshUser}
          />
        )}

        {/* Posts or Private notice */}
        {userData?.isPrivate && !userData?.followers?.includes(currentUserId) ? (
          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'white' }}>
            📛 Este perfil es privado.
          </p>
        ) : (
          <div className="user-posts-section">
            {userPosts.length === 0 ? (
              <p style={{ textAlign: 'center', marginTop: '2rem', color: 'white' }}>
                Este usuario aún no ha publicado nada.
              </p>
            ) : (
              userPosts.map((post) => (
                <PostUser
                  key={post.id}
                  id={post.id}
                  username={post.username}
                  profilePic={post.profilePic}
                  time={new Date(post.createdAt?.seconds * 1000).toLocaleString()}
                  text={editingPostId === post.id ? editedText : post.text}
                  media={post.media}
                  quacks={post.quacks}
                  sharedBy={post.sharedBy}
                  comments={post.comments}
                  isEditing={editingPostId === post.id}
                  onEdit={() => handleEdit(post.id, post.text)}
                  onSave={() => handleSave(post.id)}
                  onDelete={() => handleDelete(post.id)}
                  onChangeEdit={handleChangeEdit}
                />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default OtherUser;

