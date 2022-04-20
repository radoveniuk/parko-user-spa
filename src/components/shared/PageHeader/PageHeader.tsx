import React from 'react';
import { Link } from 'react-router-dom';

import logoImage from 'components/assets/images/logo.png';

import { HeaderLogo, HeaderText, HeaderWrapper } from './styles';

type Props = {
  children?: React.ReactNode;
}

const PageHeader = ({ children }: Props) => {
  return (
    <HeaderWrapper>
      {children}
      <Link to="/">
        <HeaderLogo src={logoImage} alt="Parko user logo"/>
        <HeaderText>Parko&nbsp;User</HeaderText>
      </Link>
    </HeaderWrapper>
  );
};

export default PageHeader;
