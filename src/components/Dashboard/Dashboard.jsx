import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from '../Star/StarryBackground';
import TopBar from '../Navigation/TopBar';
import { ProfileCard } from '../ProfileCard/ProfileCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData"));

    if (!storedUserData) {
      navigate("/"); // Redirigir si no hay usuario en sesión
    } else {
      setUserData(storedUserData);
    }
  }, [navigate]);

  return (
    <>
      <StarryBackground />
      <TopBar />
      {userData && <ProfileCard user={userData} />}
      <div className="dashboard-container">
        {/* Otros componentes del dashboard */}
      </div>
    </>
  );
};

export default Dashboard;
