import React from 'react';

import logoImage from 'components/assets/images/logo.png';

import { HeaderLogo, HeaderText, HeaderWrapper } from './styles';
import { Link } from 'react-router-dom';

const AppHeader = () => {
  return (
    <Link to="/">
      <HeaderWrapper>
        <HeaderLogo src={logoImage} alt="Parko user logo"/>
        <HeaderText>Parko User</HeaderText>
      </HeaderWrapper>
    </Link>
  );
};

export default AppHeader;
