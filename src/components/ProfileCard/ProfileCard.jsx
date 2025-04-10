import React from "react";
import "./ProfileCard.css";
import { useNavigate } from "react-router-dom";

export const ProfileCard = ({ user }) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };
  return (
    <>

<div className="profile-card p-0">
  <div className="profile-header text-center">
    {user.profilePic ? (
      <img src={user.profilePic} alt="Profile" className="profile-avatar mx-auto" />
    ) : (
      <div className="profile-avatar mx-auto default-avatar" />
    )}
  </div>
  <div className="profile-body text-center">
    <h5 className="profile-username">{user.nombre || user.email}</h5>
    <p className="profile-bio">{user.bio || "No bio available"}</p>
    <div className="profile-skills d-flex flex-wrap justify-content-center gap-2">
      {user.programmingLanguages?.length > 0 ? (
        user.programmingLanguages.map((skill, index) => (
          <span key={index} className="badge">{skill}</span>
        ))
      ) : (
        <p>No programming languages listed</p>
      )}
    </div>
  </div>
  <div className="profile-footer text-center">
    <button className="profile-button" onClick={goToProfile}>My Profile</button>
  </div>
</div>


    </>
  )
}