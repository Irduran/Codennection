import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import StarryBackground from "../Star/StarryBackground";
import Swal from "sweetalert2";
import "./Registro.css";

function Registro() {
  const location = useLocation();
  const { user } = location.state || {};
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState("");
  const [programmingLanguages, setProgrammingLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async () => {
    if (!username.trim() || !bio.trim() || programmingLanguages.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oopsi...",
        text: "Fill all the fields, pleeeease 🥺",
      });
      return;
    }

    try {
      const user = auth.currentUser;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        nombre: username,
        profilePic: profilePic ? URL.createObjectURL(profilePic) : null,
        bio: bio,
        programmingLanguages: programmingLanguages,
      });
      navigate("/dashboard", {
        state: { user: { email: user.email, displayName: username } },
      });
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar los datos. Inténtalo de nuevo.",
      });
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() !== "") {
      setProgrammingLanguages([...programmingLanguages, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  return (
    <>
      <StarryBackground />
      <div className="registro-page">
        <div className="registro-container">
          <h1>🪄Final Touches...</h1>
          <p>Email: {user?.email}</p>
          <div className="form-columns">
            <div className="form-column">
              <input
                id="email"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="bio-container">
                <textarea
                  id="bio"
                  placeholder="Bio (max 100 characters)"
                  value={bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 100) {
                      setBio(e.target.value);
                    }
                  }}
                  maxLength={100} 
                />
                <p className="char-counter">{bio.length}/100</p>
              </div>
              <div className="add-language-container">
                <input
                  id="programming"
                  type="text"
                  placeholder="Add a programming language"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                />
                <button className="add" onClick={handleAddLanguage}>
                  +
                </button>
              </div>
              <div>
                <ul>
                  {programmingLanguages.map((lang, index) => (
                    <li key={index}>{lang}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="form-column">
              <div
                className="file-drop-area"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add("dragover");
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove("dragover");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove("dragover");
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    setProfilePic(file);
                  }
                }}
              >
                <p>🖼️Drag and Drop your profile picture🖼️</p>
                <p>or</p>
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <label htmlFor="file-input" className="file-input-label">
                  Select a file...
                </label>
                {profilePic && <p>Your new photo: {profilePic.name}</p>}
              </div>
            </div>
          </div>
          <button onClick={handleRegistro}>⭐Continue⭐</button>
        </div>
      </div>
    </>
  );
}

export default Registro;
