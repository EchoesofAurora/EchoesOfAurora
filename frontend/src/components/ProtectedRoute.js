import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // If still loading auth state, return null or a loading spinner
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/Admin/SignIn" replace />;
  }
  
  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute; 