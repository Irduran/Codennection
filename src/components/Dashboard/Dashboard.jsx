import React from 'react';
import { useLocation } from 'react-router-dom';
import StarryBackground from '../Star/StarryBackground';
import './Dashboard.css';
import TopBar from '../Navigation/TopBar';

const Dashboard = () => {
  const location = useLocation();
  const user = location.state?.user;

  return (
    <>
      <StarryBackground />
      <TopBar/>
      <div className="dashboard-container">
        <h1>Hello, {user?.email}</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </>
  );
};

export default Dashboard;