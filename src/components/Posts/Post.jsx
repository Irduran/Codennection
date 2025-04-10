import React, { useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import "./Post.css";
import picture from "../../assets/blank-profile-picture.svg";
import duck from "../../assets/duck.svg";
import share from "../../assets/share.svg";

const Post = ({ username, time, text, media, quacks, comments, isEditing, onEdit, onSave, onDelete, onChangeEdit}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [liked, setLiked] = useState(false);
  const mediaCount = media.length;

  const openModal = (index) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <>
      <div className="post-container">
      <div className="post-header">
        <img src={picture} alt="Profile" className="profile-picture" />
        <div className="post-info">
          <div className="username">{username}</div>
          <div className="time">{time}</div>
        </div>
        <button className="share-button">
        <img 
            src={share} 
            alt="share" 
          />
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


          {mediaCount > 0 && (
            <div className="media-container">
              {media.map((item, index) => (
                <div key={index} onClick={() => openModal(index)} className="media-item">
                  {item.type === "image" ? (
                    <img src={item.url} alt="Post media" className="post-image" />
                  ) : (
                    <video controls className="post-video">
                      <source src={item.url} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
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
            <div className="action">{quacks} quacks</div>
            <div className="action">{comments.length} comentarios</div>
          </div>
        </div>

        <div className="comment-section">
          <img src={picture} alt="Profile" className="comment-profile-pic" />
          <input type="text" placeholder="Escribe un comentario..." className="comment-input" />
          <button type="submit" className="comment-submit">➤</button>
        </div>

        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <img src={picture} alt="Profile" className="comment-profile-pic" />
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

      {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <Carousel
                selectedItem={selectedIndex}
                showArrows={true}
                infiniteLoop={true}
                showThumbs={false}
                swipeable={true}
                showStatus={false}
              >
                {media.map((item, index) => (
                  <div key={index}>
                    {item.type === "image" ? (
                      <img src={item.url} alt={`Media ${index}`} />
                    ) : (
                      <video controls>
                        <source src={item.url} type="video/mp4" />
                      </video>
                    )}
                  </div>
                ))}
              </Carousel>
              <button className="close-modal" onClick={closeModal}>X</button>
            </div>
          </div>
        )}

    </>
  );
};

export default Post;

