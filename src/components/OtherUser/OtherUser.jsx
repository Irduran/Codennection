import React, { useEffect, useState } from 'react';
import picture from '../../assets/blank-profile-picture.svg';
import message from '../../assets/message-heart.svg';
import './OtherUser.css';
import TopBar from '../Navigation/TopBar';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const OtherUser = () => {
  const [userData, setUserData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // ID del usuario actual
  const [isFollowing, setIsFollowing] = useState(false); // Estado de seguimiento
  const { userId } = useParams(); // ID del usuario que se está viendo
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUserData({
          id: docSnap.id, // El ID generado por Firebase
          ...docSnap.data()
        });
      }
    };
    
    fetchUserData();
  }, [userId]);

  const handleFollow = () => {
    // Aquí implementarías la lógica para seguir/dejar de seguir
    // Esto es solo un ejemplo
    if (userData?.isPrivate) {
      // Lógica para solicitar seguir a un perfil privado
      console.log("Solicitud de seguimiento enviada");
    } else {
      // Lógica para seguir a un perfil público
      console.log("Ahora sigues a este usuario");
    }
    setIsFollowing(!isFollowing);
  };


  return (
    <>
      <TopBar/>
      <div className="profile-container">
        <div className="banner"></div>
        <div className="profile-section">
          <img
            src={userData?.profilePic || picture}
            alt="Profile"
            className="profile-picture"
          />

          <div className="text-info">
            <span className="info-name">{userData?.nombre || userData?.email || "Mi Nombre"}</span>
            <span className="info-bio">{userData?.bio || "¡Esta es mi biografía!"}</span>

            <div className="followers-container">
              <span className="followers-count"><strong>1.2K</strong> Seguidores</span>
              <span className="following-count"><strong>500</strong> Siguiendo</span>
            </div>

            <div className="button-container">
              {currentUserId !== userId && (
                <button 
                  className={`follow-button ${userData?.isPrivate ? 'private' : 'public'}`}
                  onClick={handleFollow}
                >
                  {userData?.isPrivate ? '!Codders' : 'Codders'}
                </button>
              )}
              
              <div className="button button-visibility"> 
                <span>{userData?.isPrivate ? 'Privado 🔒' : 'Público 🌍'}</span>
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

export default OtherUser;