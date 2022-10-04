import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from 'contexts/AuthContext';

type Props = {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const isAuth = useAuth();
  return isAuth ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
