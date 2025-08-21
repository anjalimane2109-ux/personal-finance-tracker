// src/utils/PrivateRoute.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user } = useAuth(); // Get user from AuthContext

    // If user is logged in, render the child routes (Outlet)
    // Otherwise, redirect to the login page (which is now at '/')
    return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
