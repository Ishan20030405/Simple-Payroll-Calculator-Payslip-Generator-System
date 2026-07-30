// src/components/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, checkAuth, loading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        // ✅ If authenticated but on wrong route, redirect
        if (isAuthenticated && user) {
            const currentPath = window.location.pathname;
            
            if (user.role === 'ADMIN' && currentPath === '/employee-dashboard') {
                navigate('/dashboard');
            } else if (user.role === 'EMPLOYEE' && currentPath === '/dashboard') {
                navigate('/employee-dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;