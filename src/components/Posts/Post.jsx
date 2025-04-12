import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./Post.css";
import blankProfile from "../../assets/blank-profile-picture.svg";
import duck from "../../assets/duck.svg";
import share from "../../assets/share.svg";

const Post = ({
  id,
  username,
  profilePic,
  time,
  text,
  media = [],
  quacks = 0,
  comments = [],
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onChangeEdit,
}) => {
  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const [showOptions, setShowOptions] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [currentComments, setCurrentComments] = useState(comments);
  const [currentQuacks, setCurrentQuacks] = useState(quacks);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    // Verifica si el usuario ya dio like
    const checkLike = async () => {
      const postRef = doc(db, "posts", id);
      const postSnap = await getDoc(postRef);
      const data = postSnap.data();
      if (data?.quackedBy?.includes(currentUser?.uid)) {
        setLiked(true);
      }
    };
    checkLike();
  }, [id, currentUser?.uid]);

  const toggleOptions = () => setShowOptions(!showOptions);

  const toggleLike = async () => {
    if (liked || !currentUser) return;

    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      quacks: increment(1),
      quackedBy: arrayUnion(currentUser.uid),
    });
    setLiked(true);
    setCurrentQuacks((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;

    const newComment = {
      username: currentUser.username,
      userId: currentUser.uid,
      text: commentInput,
      profilePic: currentUser.profilePic || blankProfile,
      createdAt: new Date(),
      likes: 0,
    };

    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      comments: arrayUnion(newComment),
    });

    setCurrentComments((prev) => [...prev, newComment]);
    setCommentInput("");
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <img
          src={profilePic || blankProfile}
          alt="Profile"
          className="profile-picture"
        />
        <div className="post-info">
          <div className="username">{username}</div>
          <div className="time">{time}</div>
        </div>
        <button className="share-button">
          <img src={share} alt="share" />
        </button>
        <div className="post-options-container">
          <div className="post-options" onClick={toggleOptions}>...</div>
          {showOptions && (
            <div className="options-menu">
              {isEditing ? (
                <div className="option" onClick={onSave}>Guardar</div>
              ) : (
                <div className="option" onClick={onEdit}>Editar</div>
              )}
              <div className="option" onClick={onDelete}>Borrar</div>
              <div className="option">Reportar</div>
            </div>
          )}
        </div>
      </div>

      <div className="post-content">
        {isEditing ? (
          <textarea
            className="edit-textarea"
            value={text}
            onChange={onChangeEdit}
          />
        ) : (
          <p>{text}</p>
        )}

        {media.length > 0 && (
          <div className="carousel">
            <div className="control-prev" onClick={handlePrev}>❮</div>
            <div className="media-item">
              {media[currentMediaIndex].type === "image" ? (
                <img
                  src={media[currentMediaIndex].url}
                  alt="Post media"
                  className="post-image"
                />
              ) : (
                <video controls className="post-video">
                  <source
                    src={media[currentMediaIndex].url}
                    type="video/mp4"
                  />
                </video>
              )}
            </div>
            <div className="control-next" onClick={handleNext}>❯</div>
          </div>
        )}
      </div>

      <div className="post-footer">
        <img
          src={duck}
          alt="duck"
          className={`icon ${liked ? "liked" : "unliked"}`}
          onClick={toggleLike}
        />
        <div className="actions">
          <div className="action">{currentQuacks} quacks</div>
          <div className="action">{currentComments.length} comentarios</div>
        </div>
      </div>

      <div className="comment-section">
        <img
          src={currentUser?.profilePic || blankProfile}
          alt="Profile"
          className="comment-profile-pic"
        />
        <input
          type="text"
          placeholder="Escribe un comentario..."
          className="comment-input"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button
          type="submit"
          className="comment-submit"
          onClick={handleCommentSubmit}
        >
          ➤
        </button>
      </div>

      <div className="comments-list">
        {currentComments.map((comment, index) => (
          <div key={index} className="comment">
            <img
              src={comment.profilePic || blankProfile}
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

export default Post;
