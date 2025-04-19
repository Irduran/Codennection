import edit from '../../assets/pencil-svgrepo-com.svg';
import picture from '../../assets/blank-profile-picture.svg';
import message from '../../assets/message-heart.svg';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileHeader.css';

export const ProfileHeader = ({ userData, currentUserId }) => {
  const navigate = useNavigate();

  const goToEdit = () => {
    navigate("/editprofile");
  };

  const isMyProfile = userData?.uid === currentUserId;

  return (
    <div className="my-profile-container">
      <div className="my-banner"></div>
      <div className="my-profile-section">
        <img
          src={userData?.profilePic || picture}
          alt="Profile"
          className="my-profile-picture"
        />

        {isMyProfile && (
          <button className="my-edit-icon" onClick={goToEdit}>
            <img src={edit} alt="Edit Icon" />
          </button>
        )}

        <div className="my-text-info">
          <span className="my-info-name">
            {userData?.nombre || userData?.email || "Mi Nombre"}
          </span>
          <span className="my-info-bio">
            {userData?.bio || "¡Esta es mi biografía!"}
          </span>

          <div className="my-followers-container">
            <span className="my-followers-count"><strong>1.2K</strong> Seguidores</span>
            <span className="my-following-count"><strong>500</strong> Siguiendo</span>
          </div>

          <div className="my-button-container">
            <div className="my-button button-visibility">
              <span>{userData?.isPrivate ? 'Private 🔒' : 'Public 🌍'}</span>
            </div>
            <div className="my-chat-icon">
              <img src={message} alt="Messages" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

