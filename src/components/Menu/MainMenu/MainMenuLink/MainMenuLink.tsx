import React, { ReactNode } from 'react';
import { Link, To } from 'react-router-dom';
import { StyledMenuButton } from './styles';

type Props = {
  children: ReactNode;
  to: To;
}

const MainMenuLink = ({ children, to }: Props) => (
  <Link to={to}>
    <StyledMenuButton>
      {children}
    </StyledMenuButton>
  </Link>
);

export default MainMenuLink;
