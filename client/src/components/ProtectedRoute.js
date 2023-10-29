// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthProvider';

const ProtectedRoute = ({ children, allowedAccountTypes = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }


    if (!user) {
        // User is not authenticated, redirect to login page
        return <Navigate to="/auth/login" />;
    }

    if (allowedAccountTypes.length > 0 && !allowedAccountTypes.includes(user.accountType)) {
        // User’s account type is not allowed, redirect to a not-authorized page or home page
        return <Navigate to="/not-authorized" />;
    }

    return children;
};

export default ProtectedRoute;
