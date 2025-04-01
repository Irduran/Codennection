import React from 'react';
import './ProfileCard.css';

const ProfileCard = () => {
  return (
    <div className="profile-container d-flex justify-content-center align-items-center">
      <div className="profile-card p-0">
        <div className="profile-header text-center">
          <div className="profile-avatar mx-auto"></div>
        </div>
        <div className="profile-body text-center">
          <h5 className="profile-username">Username</h5>
          <p className="profile-bio">BIO</p>
          <div className="profile-skills d-flex flex-wrap justify-content-center gap-2">
            <span className="badge">React</span>
            <span className="badge">Javascript</span>
            <span className="badge">Python</span>
            <span className="badge">Node.js</span>
          </div>
        </div>
        <div className="profile-footer text-center">
          <button className="profile-button">My Profile</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;

