import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LanguageSelector from 'components/complex/LanguageSelector';
import { NAVBAR_ITEMS } from 'constants/menu';

import 'react-pro-sidebar/dist/css/styles.css';
import { NavbarMenu, NavbarWrapper, NavItem, StyledNavbar, IconWrapper } from './styles';
import { MenuIcon } from 'components/icons';
import IconButton from 'components/shared/IconButton';

type Props = {
  toggled?: boolean,
  onToggle?(): void,
}

const Navbar = ({ toggled, onToggle } : Props) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <>
      <NavbarWrapper>
        <StyledNavbar breakPoint="sm" toggled={toggled} onToggle={onToggle}>
          <NavbarMenu>
            {NAVBAR_ITEMS.map((item) => (
              <NavItem key={item.title} active={item.to === location.pathname} icon={item.icon}>
                {t(item.title)}
                <Link to={item.to} />
              </NavItem>
            ))}
          </NavbarMenu>
          <LanguageSelector />
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
      <MenuIcon />
    </IconButton>
  </IconWrapper>
);

export default Navbar;
