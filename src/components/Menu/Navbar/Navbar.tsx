import React from 'react';
import { NavbarWrapper } from './styles';

type Props = {
  children: React.ReactNode;
};

const Navbar = ({ children }: Props) => (
  <NavbarWrapper>
    {children}
  </NavbarWrapper>
);

export default Navbar;
