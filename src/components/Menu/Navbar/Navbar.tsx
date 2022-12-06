import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

import logoImage from 'components/assets/images/logo.png';
import LanguageSelector from 'components/complex/LanguageSelector';
import LogoutButton from 'components/complex/LogoutButton';
import { MenuIcon } from 'components/icons';
import IconButton from 'components/shared/IconButton';
import { useAuthData } from 'contexts/AuthContext';
import { useNavbarActiveLink, useNavbarItems, useToggleNavbar } from 'contexts/NavbarStateContext';
import { useNotifications } from 'contexts/NotificationContext';
import { themeConfig } from 'theme';

import { Drawer, NavbarWrapper, NavItem, NavItemsList } from './styles';

export const ToggleNavbarButton = () => {
  const { open, close, expanded } = useToggleNavbar();
  return (
    <IconButton className="toggle-menu-icon" onClick={expanded ? close : open}>
      <MenuIcon size={40} color={themeConfig.palette.primary.main} />
    </IconButton>
  );
};

const DEFAULT_WIDTH = 300;
const COLLAPSED_WIDTH = 70;

const Navbar = () => {
  const { t } = useTranslation();
  const { role } = useAuthData();
  const isNewNotification = useNotifications();
  const menuItems = useNavbarItems();
  const selectedLink = useNavbarActiveLink();
  const { close, expanded } = useToggleNavbar();

  const navbarContent = (
    <NavItemsList>
      {menuItems.map((item) => (
        <Link to={item.to} key={item.title}>
          <ListItem className="list-item" title={t(item.title)}>
            <NavItem
              className={`
                ${(item.to === selectedLink) ? 'active' : ''}
                ${item.to === '/notifications' && isNewNotification ? ' notifications' : ''}
                ${expanded ? ' open' : ''}
              `}
            >
              <ListItemIcon className="nav-icon">
                {item.icon}
              </ListItemIcon>
              {expanded && <ListItemText className="nav-item-text" primary={t(item.title)} />}
            </NavItem>
          </ListItem>
        </Link>
      ))}
    </NavItemsList>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <NavbarWrapper
      component="nav"
      sx={{ width: { sm: expanded ? DEFAULT_WIDTH : COLLAPSED_WIDTH, transition: 'width 0.2s' }, flexShrink: { sm: 0 } }}
      aria-label="navbar menu"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={expanded}
        onClose={close}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DEFAULT_WIDTH },
        }}
      >
        {navbarContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: expanded ? DEFAULT_WIDTH : COLLAPSED_WIDTH,
            transition: 'width 0.2s',
            overflowX: 'hidden',
          },
        }}
        open={expanded}
      >
        <div className="app-logo">
          {expanded && (
            <>
              <img height={20} width={20} src={logoImage} alt="Parko user logo"/>
              {(!role || role === 'user') && <p>Parko&nbsp;User</p>}
              {['admin', 'recruiter'].includes(role as string) && <p>Parko&nbsp;Admin</p>}
            </>
          )}
          <ToggleNavbarButton />
        </div>
        {navbarContent}
        <div className="navbar-footer">
          <div className="actions" style={{ flexDirection: expanded ? 'row' : 'column' }}>
            <LanguageSelector fullText={expanded} />
            <LogoutButton fullText={expanded} />
          </div>
          {expanded && (
            <ul className="contactsList">
              <li><a href ="mailto:support@parko.sk">support@parko.sk</a></li>
              <li><a href="https://parko-staff.com/">parko-staff.com</a></li>
              <li><a href="tel:+421950759277">+421950759277</a></li>
            </ul>
          )}
        </div>
      </Drawer>
    </NavbarWrapper>
  );
};

export default Navbar;
