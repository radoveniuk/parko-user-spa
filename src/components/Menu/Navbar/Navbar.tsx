import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { ADMIN_NAVBAR_ITEMS, INavbarItem, NAVBAR_ITEMS } from 'constants/menu';
import { MenuIcon } from 'components/icons';
import IconButton from 'components/shared/IconButton';
import { themeConfig } from 'theme';
import { useAuthData } from 'contexts/AuthContext';

import { Drawer, NavbarWrapper, NavItem, NavItemsList } from './styles';

type Props = {
  open?: boolean,
  onClose?(): void,
}

const drawerWidth = 300;

const Navbar = ({ open, onClose } : Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { role, isNewNotifications } = useAuthData();
  let menuItems: INavbarItem[] = [];

  if (role === 'user') {
    menuItems = NAVBAR_ITEMS;
  }
  if (role === 'admin') {
    menuItems = ADMIN_NAVBAR_ITEMS;
  }

  const navbarContent = (
    <NavItemsList>
      {menuItems.map((item) => (
        <Link to={item.to} key={item.title}>
          <ListItem >
            <NavItem
              className={`${item.to === location.pathname
                ? 'active'
                : ''}${item.to === '/notifications' && isNewNotifications
                ? ' notifications'
                : ''}`
              }
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
        {navbarContent}
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
