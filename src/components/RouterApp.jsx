import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import { NotFound } from './NotFound/NotFound';
import Registro from './Registro/Registro';

export const RouterApp = () => {
    const location = useLocation();
    const validRoutes = ['/', '/dashboard', '/registro'];

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/registro" element={< Registro />} />
            <Route path="/error404" element={<NotFound />} />
            {!validRoutes.includes(location.pathname.toLowerCase()) && <Route path="*" element={<Navigate to="/error404" />} />}
        </Routes>
    );
};
