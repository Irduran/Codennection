import React, { useEffect, useState } from 'react';
import StarryBackground from '../Star/StarryBackground';
import edit from '../../assets/pencil-svgrepo-com.svg';
import picture from '../../assets/blank-profile-picture.svg';
import message from '../../assets/message-heart.svg';
import './Perfil.css';
import TopBar from '../Navigation/TopBar';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const storedData = sessionStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);
  const goToEdit = () => {
    navigate("/editprofile");
  };
  return (
    <>
      <StarryBackground />
      <TopBar/>
      <div className="profile-container">
        <div className="banner"></div>
        <div className="profile-section">

        <img
          src={userData?.profilePic || picture}
          alt="Profile"
          className="profile-picture"
        />

          <button className="edit-icon" onClick={goToEdit}>
              <img src={edit} alt="Edit Icon" />
          </button>

          <div className="text-info">
            <span className="info-name">{userData?.nombre || userData?.email || "Mi Nombre"}</span>
            <span className="info-bio">{userData?.bio || "¡Esta es mi biografía!"}</span>

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

          
        </div>
      </div>
    </>
  );
};

export default Perfil;
