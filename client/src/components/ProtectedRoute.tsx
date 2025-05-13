import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'admin' 
}) => {
  const { isAuthenticated, isAdmin, user, loading } = useAuth();
  const location = useLocation();
  
  // Effect to validate token on initial render and at intervals
  useEffect(() => {
    // Token validation would happen here in a real app
    // Periodic validation can be implemented with a timer
  }, []);

  // While checking authentication status, show loading indicator
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="body1">Verifying authentication...</Typography>
      </Box>
    );
  }

  // Check if authenticated
  if (!isAuthenticated) {
    // Redirect to login and remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole === 'admin' && !isAdmin) {
    // If admin role is required but user is not admin
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute; 