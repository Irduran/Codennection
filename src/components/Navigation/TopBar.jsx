import Navbar from "react-bootstrap/Navbar";
import logo from "./../../assets/codennectionlogo_white.png";
import "./TopBar.css";
import { Notification } from "../Notification/Notification";
import { Logout } from "../Logout/Logout";

const TopBar = () => {
  return (
    <div className="position-absolute w-100">
      <Navbar className="justify-content-evenly">
        <div className="d-flex flex-row">
          <img src={logo} className="topbar-logo" />
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
