import React from 'react';
import StarryBackground from '../Star/StarryBackground';
import './Dashboard.css';
import TopBar from '../Navigation/TopBar';

const Dashboard = () => {
  return (
    <>
      <StarryBackground />
      <TopBar/>
      <div className="dashboard-container">
      </div>
    </>
  );
};

export default Dashboard;