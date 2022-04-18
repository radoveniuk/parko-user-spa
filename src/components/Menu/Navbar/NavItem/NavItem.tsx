import React from 'react';
import { Link, To } from 'react-router-dom';
import { NavItemWrapper } from './styles';

type Props = {
  children: React.ReactNode;
  to: To;
  active?: boolean;
};

const NavItem = ({ children, to, active = false }: Props) => (
  <Link to={to}>
    <NavItemWrapper active={active}>
      {children}
    </NavItemWrapper>
  </Link>
);

export default NavItem;
