import React from 'react';
import StarryBackground from '../Star/StarryBackground';
import './Dashboard.css';
import TopBar from '../Navigation/TopBar';
import { ProfileCard } from '../ProfileCard/ProfileCard';

const Dashboard = () => {
  return (
    <>
      <StarryBackground />
      <TopBar/>
      <ProfileCard/>
      <div className="dashboard-container">
      </div>
    </>
  );
};

export default Dashboard;