import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loader, { FullPageLoaderWrapper } from 'v2/uikit/Loader';

import { useAuth, useAuthData } from 'contexts/AuthContext';

type Props = {
  permission?: string;
};

const ProtectedRoute = ({ permission }: Props) => {
  const { permissions, isFetching } = useAuthData();
  const isAuth = useAuth();
  if (isFetching) {
    return <FullPageLoaderWrapper><Loader /></FullPageLoaderWrapper>;
  }
  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  return permissions.includes(permission as string) || !permission ? <Outlet/> : <Navigate to="/not-found" />;
};

export default ProtectedRoute;
