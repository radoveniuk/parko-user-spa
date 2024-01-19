import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from 'v2/components/Header';
import Navbar from 'v2/components/Navbar/Navbar';
import { Stack } from 'v2/uikit';

import { MainWrapper } from './styles';

const PageContainer = () => (
  <>
    <Header />
    <Stack direction="row">
      <Navbar />
      <MainWrapper>
        <Outlet />
      </MainWrapper>
    </Stack>
  </>
);

export default PageContainer;
