import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import TopBar from "../Navigation/TopBar";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import Post from "../Posts/Post";
import CreatePost from "../CreatePost/CreatePost";
import "./Dashboard.css";
import Swal from "sweetalert2";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getPosts = async (currentUser) => {
    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User not found");
      return;
    }

    const freshUserData = userSnap.data();

    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredData = data.filter(
      (post) =>
        freshUserData.following.includes(post.userId) ||
        post.userId === currentUser.uid
    );

    setPosts(filteredData);
  };

  useEffect(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
    if (!storedUserData) {
      navigate("/");
    } else {
      setUserData(storedUserData);
    }
  }, [navigate]);

  useEffect(() => {
    if (userData) {
      getPosts(userData);
    }
  }, [userData]);

  const handleEdit = (postId, currentText) => {
    setEditingPostId(postId);
    setEditedText(currentText);
  };

  const handleSave = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { text: editedText });
    setEditingPostId(null);
    setEditedText("");
    getPosts(userData);
  };

  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      title: "Are you sure? 🤔",
      text: "You won't be able to recover this post!🥹",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#463961',
      cancelButtonColor: '#B0619e',
      confirmButtonText: "Yes, delete it!❌",
      cancelButtonText: "Cancel😭",
      backdrop: true,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "swal2-confirm cute-btn",
        cancelButton: "swal2-cancel cute-btn",
      },
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "posts", postId));
      getUserPosts(userData.id);

      Swal.fire({
        title: "Deleted!",
        text: "Your post has been deleted.😉",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleChangeEdit = (e) => {
    setEditedText(e.target.value);
  };

  const filteredPosts = posts.filter((post) => {
    if (!searchTerm.trim()) return true;

    const lowerText = post.text?.toLowerCase() || "";
    const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);
    return searchWords.some((word) => lowerText.includes(word));
  });

  const highlightText = (text) => {
    if (!searchTerm) return text;

    const searchWords = searchTerm.trim().split(/\s+/).filter(Boolean);
    if (searchWords.length === 0) return text;

    const regex = new RegExp(
      `(${searchWords
        .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})`,
      "gi"
    );

    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark className="highlight" key={i}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <TopBar onSearchChange={setSearchTerm} />
      {userData && <ProfileCard user={userData} />}
      <div className="dashboard-container">
        <CreatePost onPostCreated={() => getPosts(userData)} />

        {searchTerm.trim() && filteredPosts.length === 0 ? (
          <p style={{ padding: "1rem", fontStyle: "italic", color: "#888" }}>
            No se encontraron posts con el término "
            <strong>{searchTerm}</strong>"
          </p>
        ) : (
          filteredPosts.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              userId={post.userId}
              username={post.username}
              profilePic={post.profilePic}
              time={new Date(post.createdAt?.seconds * 1000).toLocaleString()}
              text={
                editingPostId === post.id
                  ? editedText
                  : highlightText(post.text || "")
              }
              media={post.media}
              quacks={post.quacks}
              sharedBy ={post.sharedBy}
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

export default Dashboard;
