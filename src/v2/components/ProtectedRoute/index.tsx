import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Loader from 'v2/uikit/Loader';

import { useAuth, useAuthData } from 'contexts/AuthContext';

const LoaderWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  matchedRoles: string[]
};

const ProtectedRoute = ({ matchedRoles }: Props) => {
  const { role, isFetching } = useAuthData();
  const isAuth = useAuth();
  if (isFetching) {
    return <LoaderWrapper><Loader /></LoaderWrapper>;
  }
  return (isAuth && matchedRoles.includes(role as string)) ? <Outlet/> : <Navigate to="/login" />;
};

export default ProtectedRoute;
