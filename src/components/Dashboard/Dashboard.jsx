<<<<<<< Updated upstream
import React from 'react';
import StarryBackground from '../Star/StarryBackground';
import './Dashboard.css';
import TopBar from '../Navigation/TopBar';

const Dashboard = () => {
  return (
    <>
      <StarryBackground />
      <TopBar/>
      <div className="dashboard-container">
=======
import React, { useState, useEffect } from "react";
import StarryBackground from "../Star/StarryBackground";
import "../Dashboard/Dashboard.css";
import TopBar from "../Navigation/TopBar";
import ProfileCard from "../ProfileCard/ProfileCard";
import PostList from "../PostList/PostList";
import CreatePost from "../CreatePost/CreatePost";
import { db, collection, onSnapshot, addDoc } from "../../firebase";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);

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
      <div className="posts-section">
        <PostList posts={posts} />
>>>>>>> Stashed changes
      </div>
    </div>
  </>
);

};

<<<<<<< Updated upstream
export default Dashboard;
=======
export default Dashboard;

>>>>>>> Stashed changes
