import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loader, { FullPageLoaderWrapper } from 'v2/uikit/Loader';

import { useAuth, useAuthData } from 'contexts/AuthContext';

type Props = {
  matchedRoles: string[]
};

const ProtectedRoute = ({ matchedRoles }: Props) => {
  const { role, isFetching } = useAuthData();
  const isAuth = useAuth();
  if (isFetching) {
    return <FullPageLoaderWrapper><Loader /></FullPageLoaderWrapper>;
  }
  return (isAuth && matchedRoles.includes(role as string)) ? <Outlet/> : <Navigate to="/login" />;
};

export default ProtectedRoute;
