import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LanguageSelector from 'components/complex/LanguageSelector';
import { NAVBAR_ITEMS } from 'constants/menu';

import 'react-pro-sidebar/dist/css/styles.css';
import { NavbarMenu, NavbarWrapper, NavItem, StyledNavbar } from './styles';

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [toggled, setToggled] = useState(false);

  return (
    <NavbarWrapper>
      <StyledNavbar breakPoint='sm' toggled={toggled} onToggle={() => void setToggled(!toggled)}>
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
  );
};

export default Navbar;
