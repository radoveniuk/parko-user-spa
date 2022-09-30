import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

import logoImage from 'components/assets/images/logo.png';
import LanguageSelector from 'components/complex/LanguageSelector';
import LogoutButton from 'components/complex/LogoutButton';
import { MenuIcon } from 'components/icons';
import IconButton from 'components/shared/IconButton';
import { ADMIN_NAVBAR_ITEMS, INavbarItem, LITE_NAVBAR_ITEMS, NAVBAR_ITEMS } from 'constants/menu';
import { useAuthData } from 'contexts/AuthContext';
import { useNotifications } from 'contexts/NotificationContext';
import { themeConfig } from 'theme';

import { Drawer, NavbarWrapper, NavItem, NavItemsList } from './styles';

type Props = {
  open?: boolean,
  onClose?(): void,
}

const drawerWidth = 300;

const Navbar = ({ open, onClose } : Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { role, isVerified } = useAuthData();
  const isNewNotification = useNotifications();
  let menuItems: INavbarItem[] = [];

  if (role === 'user' && isVerified) {
    menuItems = NAVBAR_ITEMS;
  }
  if (role === 'user' && !isVerified) {
    menuItems = LITE_NAVBAR_ITEMS;
  }
  if (role === 'admin') {
    menuItems = ADMIN_NAVBAR_ITEMS;
  }

  const navbarContent = (
    <NavItemsList>
      {menuItems.map((item) => (
        <Link to={item.to} key={item.title}>
          <ListItem className="list-item">
            <NavItem
              className={`
                ${(item.to === location.pathname || item?.relativeLocations?.includes(location.pathname.split('/')[1])) ? 'active' : ''}
                ${item.to === '/notifications' && isNewNotification ? ' notifications' : ''}
              `}
            >
              <ListItemIcon className="nav-icon">
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={t(item.title)} />
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
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="navbar menu"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {navbarContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        <div className="app-logo">
          <img height={20} width={20} src={logoImage} alt="Parko user logo"/>
          {(!role || role === 'user') && <p>Parko&nbsp;User</p>}
          {role === 'admin' && <p>Parko&nbsp;Admin</p>}
        </div>
        {navbarContent}
        <div className="navbar-footer">
          <div className="actions">
            <LanguageSelector />
            <LogoutButton />
          </div>
          <ul className="contactsList">
            <li><a href ="mailto:support@parko.sk">support@parko.sk</a></li>
            <li><a href="https://parko-staff.com/">parko-staff.com</a></li>
            <li><a href="tel:+421950759277">+421950759277</a></li>
          </ul>
        </div>
      </Drawer>
    </NavbarWrapper>
  );
};

type ToggleButtonProps = {
  onClick(): void
}

export const ToggleNavbarButton = ({ onClick }: ToggleButtonProps) => (
  <IconButton className="toggle-menu-icon" onClick={onClick} sx={{ ml: 2, display: { sm: 'none' } }}>
    <MenuIcon size={40} color={themeConfig.palette.primary.main} />
  </IconButton>
);

export default Navbar;
