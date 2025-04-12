// src/components/Dashboard/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import TopBar from "../Navigation/TopBar";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import Post from "../Posts/Post";
import CreatePost from "../CreatePost/CreatePost";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

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

  return (
    <>
      <TopBar />
      {userData && <ProfileCard user={userData} />}
      <div className="dashboard-container">
        <CreatePost onPostCreated={getPosts} />
        {posts.map((post) => (
          <Post
            key={post.id}
            username={post.username}
            profilePic={post.profilePic}
            time={new Date(post.createdAt?.seconds * 1000).toLocaleString()}
            text={post.text}
            media={post.media}
            quacks={post.quacks}
            comments={post.comments}
          />
        ))}
      </div>
    </>
  );
};

export default Dashboard;
