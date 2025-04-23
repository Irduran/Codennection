import React, { useEffect, useState } from 'react';
import edit from '../../assets/pencil-svgrepo-com.svg';
import './ProfileHeader.css';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export const ProfileHeader = ({ userData, currentUserId, refreshUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('Follow');
  const [buttonClass, setButtonClass] = useState('default');


  const navigate = useNavigate();

  const goToEdit = () => {
    navigate("/editprofile");
  };

  // Detect if viewing own profile
  useEffect(() => {
    if (userData && currentUserId) {
      setIsMyProfile(userData?.id === currentUserId);
    }
  }, [userData, currentUserId]);

  // Check if following target user
  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (!userData?.id || !currentUserId || isMyProfile) return;

      const currentUserRef = doc(db, 'users', currentUserId);
      const currentUserSnap = await getDoc(currentUserRef);
      const currentUserData = currentUserSnap.data();

      setIsFollowing(currentUserData?.following?.includes(userData.id) || false);
    };

    checkFollowingStatus();
  }, [userData, currentUserId, isMyProfile]);

  // Set button label based on following status and profile privacy
  useEffect(() => {
    if (isMyProfile || !currentUserId) return;

    if (isFollowing) {
      setButtonLabel('Codders');
      setButtonClass('codders');
    } else if (userData?.isPrivate) {
      setButtonLabel('? Codders');
    } else {
      setButtonLabel('Follow');
      setButtonClass('default');
    }
  }, [isFollowing, userData, isMyProfile, currentUserId]);

  const handleFollowToggle = async () => {
    if (!userData?.id || !currentUserId) {
      console.error("Usuario no válido o no autenticado.");
      return;
    }

    try {
      const currentUserRef = doc(db, 'users', currentUserId);
      const targetUserRef = doc(db, 'users', userData.id);

      const currentUserSnap = await getDoc(currentUserRef);
      const targetUserSnap = await getDoc(targetUserRef);

      if (!currentUserSnap.exists() || !targetUserSnap.exists()) {
        console.error("Uno o ambos usuarios no existen en Firestore.");
        return;
      }

      const currentUserData = currentUserSnap.data();
      const alreadyFollowing = currentUserData.following?.includes(userData.id);

      if (alreadyFollowing) {
        await updateDoc(currentUserRef, {
          following: arrayRemove(userData.id),
        });
        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUserId),
        });
        setIsFollowing(false);
      } else {
        await updateDoc(currentUserRef, {
          following: arrayUnion(userData.id),
        });
        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUserId),
        });
        setIsFollowing(true);
      }

      if (refreshUser) refreshUser();

    } catch (error) {
      console.error("Error al intentar seguir o dejar de seguir:", error);
    }
  };

  const handleButtonClick = () => {
    if (userData?.isPrivate && !isFollowing) {
      console.log(`send request to ${userData?.nombre || userData?.email}`);
    } else {
      handleFollowToggle();
    }
  };

  const handleMouseEnter = () => {
    if (isFollowing) {
      setButtonLabel('!Codders');
      setButtonClass('codders');
    }
  };
  
  const handleMouseLeave = () => {
    if (isFollowing) {
      setButtonLabel('Codders');
      setButtonClass('codders');
    }
  };
  
  return (
    <div className="my-profile-container">
      <div className="my-banner"></div>
      <div className="my-profile-section">
        <img
          src={userData?.profilePic || 'path-to-default-image'}
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
            {userData?.nombre || userData?.email || 'Mi Nombre'}
          </span>
          <span className="my-info-bio">
            {userData?.bio || '¡Esta es mi biografía!'}
          </span>

          <div className="my-followers-container">
            <span className="my-followers-count">
              <strong>{userData?.followers?.length || 0}</strong> Seguidores
            </span>
            <span className="my-following-count">
              <strong>{userData?.following?.length || 0}</strong> Siguiendo
            </span>
          </div>

          <div className="my-button-container">
            <div className="my-button button-visibility">
              <span>{userData?.isPrivate ? 'Private 🔒' : 'Public 🌍'}</span>
            </div>

            {!isMyProfile && currentUserId && (
              <button
                className={`follow-btn ${buttonClass}`}
                onClick={handleButtonClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {buttonLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



