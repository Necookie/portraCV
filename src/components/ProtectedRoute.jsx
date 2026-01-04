import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <AuthModal isOpen={true} onClose={() => {}} />;
  }

  return children;
};

export default ProtectedRoute;
