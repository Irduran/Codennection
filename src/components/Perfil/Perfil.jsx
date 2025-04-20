import React, { useEffect, useState } from 'react';
import './Perfil.css';
import TopBar from '../Navigation/TopBar';
import { collection, getDocs, query, orderBy, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import PostUser from '../PostUser/PostUser';
import { ProfileHeader } from '../ProfileHeader/ProfileHeader';
import { getAuth } from 'firebase/auth';

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const storedData = sessionStorage.getItem("userData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      fetchUserData(parsedData.uid);
      getUserPosts(parsedData.uid);
    }
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setCurrentUserId(currentUser.uid);
    }
  }, []);

  const fetchUserData = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setUserData({ ...userSnap.data(), id: uid });
    }
  };

  const getUserPosts = async (uid) => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const userPosts = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((post) => post.userId === uid);
    setPosts(userPosts);
  };

  const handleEdit = (postId, currentText) => {
    setEditingPostId(postId);
    setEditedText(currentText);
  };

  const handleSave = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { text: editedText });
    setEditingPostId(null);
    setEditedText("");
    getUserPosts(userData.id);
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("¿Seguro que quieres borrar este post?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "posts", postId));
    getUserPosts(userData.id);
  };

  const handleChangeEdit = (e) => {
    setEditedText(e.target.value);
  };

  return (
    <>
      <TopBar />

      <div className='mypost-container'>
        {userData && (
          <ProfileHeader
            userData={userData}
            currentUserId={currentUserId}
            refreshUser={() => fetchUserData(userData.id)}
            isMyProfile={userData.id === currentUserId} // Pasa la verificación aquí
          />
        )}

        <div className="user-posts-section">
          {userPosts.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>No has publicado nada aún.</p>
          ) : (
            userPosts.map((post) => (
              <PostUser
                key={post.id}
                id={post.id}
                userId={post.userId}
                username={post.username}
                profilePic={post.profilePic}
                time={new Date(post.createdAt?.seconds * 1000).toLocaleString()}
                text={editingPostId === post.id ? editedText : post.text}
                media={post.media}
                quacks={post.quacks}
                comments={post.comments}
                isEditing={editingPostId === post.id}
                {...(post.userId === currentUserId && {
                  onEdit: () => handleEdit(post.id, post.text),
                  onSave: () => handleSave(post.id),
                  onDelete: () => handleDelete(post.id),
                  onChangeEdit: handleChangeEdit,
                })}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Perfil;

