import { Box, Drawer as DrawerMaterial, List, ListItemButton } from '@mui/material';
import styled from 'styled-components';

import { colors } from 'theme';

export const NavbarWrapper = styled(Box)`
  a {
    color: #fff;
  }

  .list-item {
    padding-top: 0;
    padding-bottom: 1px;
    padding-left: 1px;
    padding-right: 1px;
  }

  .app-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 18px 10px 10px 10px;
    a {
      display: flex;
      justify-content: center;
      width: min-content;
      margin: 30px auto;
    }

    img {
      width: 30px;
      height: 30px;
    }

    p {
      font-size: 30px;
      color: #30384F;
      margin: 0;
      font-weight: 400;
    }
  }

  .navbar-footer {
    .actions {
      display: flex;
      gap: 10px;
      padding: 10px;
    }

    .contactsList {
      list-style-type: none;
      li {
        margin-bottom: 15px;
        font-size: 18px;
        a {
          color: ${colors.secondary};
          transition: color 0.3s;
          &:hover {
            color: ${colors.secondaryDark};
          }
        }
      }
    }
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
      background-color: #fff;
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
