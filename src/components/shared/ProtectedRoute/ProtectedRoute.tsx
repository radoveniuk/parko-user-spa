import { useAuth } from 'contexts/AuthContext';
import React from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const isAuth = useAuth();
  return isAuth ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
