import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  increment,
  getDoc,
  arrayRemove
} from "firebase/firestore";
import { db } from "../../firebase";
import "./PostUser.css";
import blankProfile from "../../assets/blank-profile-picture.svg";
import duck from "../../assets/duck.svg";
import share from "../../assets/share.svg";
import CommentSection from "../Comments/CommentSection";


const PostUser = ({
  id,
  username,
  profilePic,
  time,
  text,
  media = [],
  quacks = 0,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onChangeEdit,
}) => {
  const currentUser = JSON.parse(sessionStorage.getItem("userData"));
  const [showOptions, setShowOptions] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
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

  useEffect(() => {
    const checkOwner = async () => {
      const postRef = doc(db, "posts", id);
      const postSnap = await getDoc(postRef);
      const data = postSnap.data();
      if (data?.userId === currentUser?.uid) {
        setIsOwner(true);
      }
    };
    checkOwner();
  }, [id, currentUser?.uid]);

  const toggleOptions = () => setShowOptions(!showOptions);

  const toggleLike = async () => {
    if (!currentUser) return;
  
    const postRef = doc(db, "posts", id);
  
    if (liked) {
      // Si ya le dio like, entonces lo quita
      await updateDoc(postRef, {
        quacks: increment(-1),
        quackedBy: arrayRemove(currentUser.uid),
      });
      setLiked(false);
      setCurrentQuacks((prev) => prev - 1);
    } else {
      // Si no le ha dado like, lo da
      await updateDoc(postRef, {
        quacks: increment(1),
        quackedBy: arrayUnion(currentUser.uid),
      });
      setLiked(true);
      setCurrentQuacks((prev) => prev + 1);
    }
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
  

  return (
<div className="post-container">
      <div className="post-header">
      <div className="profile-picture-container">
          <img
            src={profilePic || blankProfile}
            alt="Profile"
          />
        </div>
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
            {isOwner && (
              <>
                {isEditing ? (
                  <div className="option" onClick={onSave}>Guardar</div>
                ) : (
                  <div className="option" onClick={onEdit}>Editar</div>
                )}
                <div className="option" onClick={onDelete}>Borrar</div>
              </>
            )}
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
          <div className="media-item">
            {media.length > 1 && (
              <>
                <div className="control-prev" onClick={handlePrev}>❮</div>
                <div className="control-next" onClick={handleNext}>❯</div>
              </>
            )}

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
          <div className="action"> comentarios</div>
        </div>
      </div>
      <CommentSection postId={id} />
    </div>
    
  );
};


export default PostUser;
