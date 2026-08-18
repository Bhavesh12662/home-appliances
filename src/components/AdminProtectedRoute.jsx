import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loader-container">Authenticating admin...</div>;
  }

  // Only allow access if user is logged in and has the 'admin' role
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;