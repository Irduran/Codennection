import React from 'react';
import StarryBackground from '../Star/StarryBackground';
import edit from '../../assets/pencil-svgrepo-com.svg';
import picture from '../../assets/blank-profile-picture.svg';
import message from '../../assets/message-heart.svg';
import './Perfil.css';

const Perfil = () => {
  return (
    <>
      <StarryBackground />
    <div className="profile-container">
      <div className="banner"></div>
      <div className="profile-section">

        <img src={picture} alt="Profile" className="profile-picture" />

        <div className="edit-icon">
            <img src={edit} alt="Edit Icon" />
        </div>

        <div className="text-info">
          <span className="info-name">Mi Nombre</span>
          <span className="info-bio">Está es mi biografía!</span>

        <div className="followers-container">
            <span className="followers-count"><strong>1.2K</strong> Seguidores</span>
            <span className="following-count"><strong>500</strong> Siguiendo</span>
        </div>

          <div className="button-container">
            <div className="button button-visibility"> 
              <span>Privado 🔒</span>
            </div>
            <div className="chat-icon">
                <img src={message} alt="Messages" />
            </div>
          </div>
        </div>

        <div className="location">
          <span className="text-location">📍 Ubicación</span>
        </div>
      </div>
    </div>
    </>
  );
};

export default Perfil;