import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin, requireStaff }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !user.roles?.includes('ADMIN')) {
    return <Navigate to="/dashboard" />;
  }

  if (requireStaff && !user.roles?.includes('STAFF') && !user.roles?.includes('ADMIN')) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
