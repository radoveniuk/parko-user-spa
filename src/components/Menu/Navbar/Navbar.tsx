import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ADMIN_NAVBAR_ITEMS, INavbarItem, NAVBAR_ITEMS } from 'constants/menu';
import { MenuIcon } from 'components/icons';
import IconButton from 'components/shared/IconButton';
import { themeConfig } from 'theme';
import { useAuthData } from 'contexts/AuthContext';

import { NavbarMenu, NavbarWrapper, NavItem, StyledNavbar, IconWrapper } from './styles';
import 'react-pro-sidebar/dist/css/styles.css';

type Props = {
  toggled?: boolean,
  onToggle?(): void,
}

const Navbar = ({ toggled, onToggle } : Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { role } = useAuthData();
  let menuItems: INavbarItem[] = [];

  if (role === 'user') {
    menuItems = NAVBAR_ITEMS;
  }
  if (role === 'admin') {
    menuItems = ADMIN_NAVBAR_ITEMS;
  }

  return (
    <>
      <NavbarWrapper>
        <StyledNavbar breakPoint="sm" toggled={toggled} onToggle={onToggle}>
          <NavbarMenu>
            {menuItems.map((item) => (
              <NavItem key={item.title} active={item.to === location.pathname} icon={item.icon}>
                {t(item.title)}
                <Link to={item.to} />
              </NavItem>
            ))}
          </NavbarMenu>
        </StyledNavbar>
      </NavbarWrapper>
    </>
  );
};

type ToggleButtonProps = {
  onClick(): void
}

export const ToggleNavbarButton = ({ onClick }: ToggleButtonProps) => (
  <IconWrapper>
    <IconButton className="toggle-menu-icon" onClick={onClick}>
      <MenuIcon size={40} color={themeConfig.palette.primary.main} />
    </IconButton>
  </IconWrapper>
);

export default Navbar;
