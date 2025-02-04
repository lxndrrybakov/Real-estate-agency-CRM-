import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Profile } from '../types/database';

interface PrivateRouteProps {
  children: (profile: Profile | null) => React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { profile } = useAuth();

  if (!profile) {
    return <Navigate to="/login" />;
  }

  return <>{children(profile)}</>;
};

export default PrivateRoute;