import React from 'react';

import logoImage from 'components/assets/images/logo.png';

import { HeaderLogo, HeaderText, HeaderWrapper } from './styles';
import { Link } from 'react-router-dom';

const PageHeader = () => {
  return (
    <HeaderWrapper>
      <Link to="/">
        <HeaderLogo src={logoImage} alt="Parko user logo"/>
        <HeaderText>Parko&nbsp;User</HeaderText>
      </Link>
    </HeaderWrapper>
  );
};

export default PageHeader;
