import React, { HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

import logoImage from 'components/assets/images/logo.png';
import { useAuthData } from 'contexts/AuthContext';

import { HeaderLogo, HeaderText, HeaderWrapper } from './styles';

type Props = {
  children?: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const PageHeader = ({ children, ...rest }: Props) => {
  const { role } = useAuthData();
  return (
    <HeaderWrapper {...rest}>
      {children}
      <Link to="/">
        <HeaderLogo src={logoImage} alt="Parko user logo"/>
        {(!role || role === 'user') && <HeaderText>Parko&nbsp;User</HeaderText>}
        {role === 'admin' && <HeaderText>Parko&nbsp;Admin</HeaderText>}
      </Link>
    </HeaderWrapper>
  );
};

export default PageHeader;
