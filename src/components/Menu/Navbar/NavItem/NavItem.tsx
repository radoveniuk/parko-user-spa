import React from 'react';
import { Link, To } from 'react-router-dom';
import { NavItemWrapper } from './styles';

type Props = {
  children: React.ReactNode;
  to: To;
};

const NavItem = ({ children, to }: Props) => (
  <Link to={to}>
    <NavItemWrapper>
      {children}
    </NavItemWrapper>
  </Link>
);

export default NavItem;
