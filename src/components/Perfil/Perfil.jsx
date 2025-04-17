import React, { useEffect, useState } from 'react';
import edit from '../../assets/pencil-svgrepo-com.svg';
import picture from '../../assets/blank-profile-picture.svg';
import message from '../../assets/message-heart.svg';
import './Perfil.css';
import TopBar from '../Navigation/TopBar';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Postuser from "../PostUser/PostUser";
import PostUser from '../PostUser/PostUser';

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedData = sessionStorage.getItem("userData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
      getUserPosts(parsedData.uid);
    }
  }, []);

  const getUserPosts = async (uid) => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const userPosts = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((post) => post.userId === uid);
    setPosts(userPosts);
  };

  const goToEdit = () => {
    navigate("/editprofile");
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
    getUserPosts(userData.uid);
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("¿Seguro que quieres borrar este post?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "posts", postId));
    getUserPosts(userData.uid);
  };

  const handleChangeEdit = (e) => {
    setEditedText(e.target.value);
  };

  return (
    <>
      <TopBar />
      <div className="profile-container">
        <div className="banner"></div>
        <div className="profile-section">
          <img
            src={userData?.profilePic || picture}
            alt="Profile"
            className="profile-picture"
          />
          <button className="edit-icon" onClick={goToEdit}>
            <img src={edit} alt="Edit Icon" />
          </button>

          <div className="text-info">
            <span className="info-name">{userData?.nombre || userData?.email || "Mi Nombre"}</span>
            <span className="info-bio">{userData?.bio || "¡Esta es mi biografía!"}</span>

            <div className="followers-container">
              <span className="followers-count"><strong>1.2K</strong> Seguidores</span>
              <span className="following-count"><strong>500</strong> Siguiendo</span>
            </div>

            <div className="button-container">
              <div className="button button-visibility">
                <span>{userData?.isPrivate ? 'Private 🔒' : 'Public 🌍'}</span>
              </div>
              <div className="chat-icon">
                <img src={message} alt="Messages" />
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="user-posts-section">
        {userPosts.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>No has publicado nada aún.</p>
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
    </>
  );
};

export default Perfil;
