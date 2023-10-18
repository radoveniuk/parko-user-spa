import React from 'react';

import { ReactComponent as LogoIcon } from 'components/assets/images/logo_v2.svg';

import { LogoWrapper } from './styles';

const Logo = () => (
  <LogoWrapper>
    <LogoIcon />
    <h1>ParkoStaff</h1>
  </LogoWrapper>
);

export default Logo;
