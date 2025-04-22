import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "./Notification.css";

export const Notification = () => {
  return (
    <div className="">
      <div className="topbar-notification-round">
        <FontAwesomeIcon icon={faBell} className="topbar-notification" />
      </div>
    </div>
  );
};
