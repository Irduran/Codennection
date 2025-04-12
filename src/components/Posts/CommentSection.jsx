import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import picture from "../../assets/blank-profile-picture.svg";

const CommentSection = ({ postId }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const userData = JSON.parse(sessionStorage.getItem("userData"));

  useEffect(() => {
    const q = query(collection(db, "comments"), where("postId", "==", postId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = [];
      querySnapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() });
      });
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addDoc(collection(db, "comments"), {
        postId,
        userId: userData.uid,
        username: userData.nombre || userData.email,
        profilePic: userData.profilePic || null,
        text: commentText,
        createdAt: serverTimestamp(),
        likes: 0,
      });
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div className="comment-section">
      <form onSubmit={handleCommentSubmit}>
        <img
          src={userData.profilePic || picture}
          alt="Profile"
          className="comment-profile-pic"
        />
        <input
          type="text"
          placeholder="Escribe un comentario..."
          className="comment-input"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit" className="comment-submit">
          ➤
        </button>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <img
              src={comment.profilePic || picture}
              alt="Profile"
              className="comment-profile-pic"
            />
            <span className="commenter-name">{comment.username}</span>
            <span className="comment-text">{comment.text}</span>
            <div className="comment-actions">
              <div className="like-button">{comment.likes} Quacks</div>
              <span className="reply-text">Responder</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
