import { Box, Drawer as DrawerMaterial, List, ListItemButton } from '@mui/material';
import styled from 'styled-components';
import { colors } from 'theme';

export const NavbarWrapper = styled(Box)`
  a {
    color: #fff;
  }
`;

export const NavItem = styled(ListItemButton)`
  background-color: ${colors.secondary} !important;
  color: #fff;
  height: 70px;
  color: #fff !important;
  transition: background-color 0.3s;
  
  .nav-icon {
    color: #fff !important;
  }
  
  span {
    font-size: 20px !important;
  }
  
  &.active, &:hover {
    background-color: ${colors.secondaryDark} !important;
  }

  &.notifications {
    .MuiListItemText-primary::after {
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #ff6666;
      position: absolute;
    }
  }
`;

export const NavItemsList = styled(List)`
  background-color: ${colors.navBackground};
`;

export const Drawer = styled(DrawerMaterial)`
  .MuiDrawer-paper {
    background-color: ${colors.navBackground} !important;
  }
`;
