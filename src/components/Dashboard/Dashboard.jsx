// src/components/Dashboard/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import TopBar from "../Navigation/TopBar";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import Post from "../Posts/Post";
import CreatePost from "../CreatePost/CreatePost";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const getPosts = async () => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(data);
  };

  useEffect(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
    if (!storedUserData) {
      navigate("/");
    } else {
      setUserData(storedUserData);
      getPosts();
    }
  }, [navigate]);
  const handleEdit = (postId, currentText) => {
    setEditingPostId(postId);
    setEditedText(currentText);
  };
  
  const handleSave = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { text: editedText });
    setEditingPostId(null);
    setEditedText("");
    getPosts(); // Recarga los posts actualizados
  };
  
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("¿Seguro que quieres borrar este post?");
    if (!confirmDelete) return;
  
    await deleteDoc(doc(db, "posts", postId));
    getPosts(); // Actualiza la lista de posts
  };
  
  const handleChangeEdit = (e) => {
    setEditedText(e.target.value);
  };

  return (
    <>
      <TopBar />
      {userData && <ProfileCard user={userData} />}
      <div className="dashboard-container">
        <CreatePost onPostCreated={getPosts} />
        {posts.map((post) => (
          <Post
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
        ))}
      </div>
    </>
  );
};

export default Dashboard;
