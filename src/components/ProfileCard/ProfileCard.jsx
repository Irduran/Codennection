import React from "react";
import "./ProfileCard.css";

export const ProfileCard = ({ user }) => {
  return (
    <>
    <div className="profile-container d-flex justify-content-center align-items-center">
      <div className="profile-card p-0">
        <div className="profile-header text-center">
          <div className="profile-avatar mx-auto"></div>
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
          <button className="profile-button">My Profile</button>
        </div>
      </div>
    </div>
    </>
  )
}
