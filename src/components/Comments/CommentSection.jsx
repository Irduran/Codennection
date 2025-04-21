import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./CommentSection.css";

const CommentSection = ({ postId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const currentUser = JSON.parse(sessionStorage.getItem("userData"));

  useEffect(() => {
    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentList);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const commentData = {
        commentedBy: currentUser.nombre,
        commentedUid: currentUser.uid,
        profilePic: currentUser.profilePic || "user",
        text: comment.trim(),
        createdAt: serverTimestamp(),
      };
      

    try {
      await addDoc(collection(db, "posts", postId, "comments"), commentData);
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Escribe un comentario..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="comment-input"
        />
        <button type="submit" className="comment-btn">Enviar</button>
      </form>

      <div className="comment-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-item">
            <img src={c.profilePic} alt="user" className="comment-avatar" />
            <div className="comment-content">
              <span className="comment-username">{c.commentedBy}</span>
              <p className="comment-text">{c.text}</p>
              <span className="comment-time">
                {c.createdAt?.seconds &&
                  new Date(c.createdAt.seconds * 1000).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;