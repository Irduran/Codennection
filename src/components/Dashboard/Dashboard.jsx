import React, { useState, useEffect } from "react";
import StarryBackground from "../Star/StarryBackground";
import "../Dashboard/Dashboard.css";
import TopBar from "../Navigation/TopBar";
import  ProfileCard  from "../ProfileCard/ProfileCard";
import PostList from "../PostList/PostList";
import CreatePost from "../CreatePost/CreatePost";
import { db, collection, onSnapshot, addDoc } from "../../firebase";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);

  /*Cargar publicaciones desde Firebase al montar el componente */
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postsArray);
    });

    return () => unsubscribe();
  }, []);

  /* Función para agregar una nueva publicación a Firebase */
  const addPost = async (newPost) => {
    try {
      await addDoc(collection(db, "posts"), {
        ...newPost,
        author: "usuario1",
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error al publicar:", error);
    }
  };

  return (
    <>
      <StarryBackground />
      <TopBar />
      <ProfileCard />
      <div className="dashboard-container">
        <CreatePost addPost={addPost} />
        <PostList posts={posts} />
      </div>
    </>
  );
};

export default Dashboard;
