import React, { useState, useEffect, useRef } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  increment,
  getDoc,
  addDoc,
  arrayRemove,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./Post.css";
import blankProfile from "../../assets/blank-profile-picture.svg";
import duck from "../../assets/duck.svg";
import share from "../../assets/share.svg";
import CommentSection from "../Comments/CommentSection";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Post = ({
  id,
  username,
  userId,
  profilePic,
  time,
  text,
  media = [],
  quacks = 0,
  sharedBy,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onChangeEdit,
  onPostShared
}) => {
  const currentUser = JSON.parse(sessionStorage.getItem("userData"));
  const [showOptions, setShowOptions] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [currentQuacks, setCurrentQuacks] = useState(quacks);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const optionsRef = useRef(null);

  useEffect(() => {
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

  // Detecta clics fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  const toggleOptions = () => setShowOptions(!showOptions);

  const toggleLike = async () => {
    if (!currentUser) return;

    const postRef = doc(db, "posts", id);

    if (liked) {
      await updateDoc(postRef, {
        quacks: increment(-1),
        quackedBy: arrayRemove(currentUser.uid),
      });
      setLiked(false);
      setCurrentQuacks((prev) => prev - 1);
    } else {
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

  const handleShare = async () => {
    if (!currentUser) return;
  
    const postRef = doc(db, "posts", id); 
    const postSnap = await getDoc(postRef); 
  
    if (postSnap.exists()) {
      const originalPost = postSnap.data();
  
      await addDoc(collection(db, "posts"), {
        ...originalPost, 
        userId: currentUser.uid,  
        quacks: 0,  
        createdAt: serverTimestamp(),
        quackedBy: [],  
        sharedBy: currentUser.nombre,  
      });
  
      Swal.fire({
        icon: "success",
        title: "Post shared!",
        text: "Your post has been shared successfully!",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        if (onPostShared) {
          onPostShared();
        }
      });
      
    }
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
          <Link
            to={userId === currentUser?.uid ? '/profile' : `/user/${userId}`}
            className="username"
          >
            {username}
          </Link>
          <div className="time">{time}</div>
          {sharedBy && (
          <div className="shared-label">
            Shared by {sharedBy}
          </div>
        )}
        </div>
        <button className="share-button" onClick={handleShare}>
          <img src={share} alt="share" />
        </button>
        <div className="post-options" onClick={toggleOptions}>⋯</div>
        {showOptions && (
          <div className="options-menu" ref={optionsRef}>
              {isOwner && (
                <>
                  {!sharedBy && (
                    isEditing ? (
                      <div className="option" onClick={onSave}>Save✨</div>
                    ) : (
                      <div className="option" onClick={onEdit}>Edit🖋️</div>
                    )
                  )}
                  <div className="option" onClick={onDelete}>Delete❌</div>
                </>
              )}
            <div className="option">Report👀</div>
          </div>
        )}
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
          <div className="action">{currentQuacks} Quacks!</div>
          <div className="action"> Comments📨</div>
        </div>
      </div>
      <CommentSection postId={id} />
    </div>
  );
};

export default Post;
