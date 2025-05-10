import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show nothing while checking authentication status
  if (loading) {
    return null;
  }

  // Redirect to login if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated and admin
  return <>{children}</>;
};

export default ProtectedRoute; 