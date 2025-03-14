import React from "react";
import Navbar from "react-bootstrap/Navbar";
import logo from "./../../assets/codennectionlogo_white.png";
import "./TopBar.css";
import { Notification } from "../Notification/Notification";
import { Logout } from "../Logout/Logout";
import { useNavigate } from "react-router-dom"; 

const TopBar = () => {
  const navigate = useNavigate(); 

  const handleLogoClick = () => {
    navigate("/dashboard"); 
  };

  return (
    <div className="position-absolute w-100">
      <Navbar className="justify-content-evenly">
        <div className="d-flex flex-row">
          <img
            src={logo}
            className="topbar-logo"
            alt="logo"
            onClick={handleLogoClick} 
            style={{ cursor: "pointer" }}
          />
          <span className="topbar-name">codennections</span>
          <input type="text" placeholder="Search" className="topbar-search" />
        </div>
        <Notification />
        <Logout />
      </Navbar>
    </div>
  );
};

export default TopBar;