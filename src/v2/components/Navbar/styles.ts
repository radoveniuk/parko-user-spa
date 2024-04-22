import { Accordion, Box, Drawer as DrawerMaterial, ListItemButton } from '@mui/material';
import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM, TB } from 'theme/sizeBreakpoints';

export const NavbarWrapper = styled(Box)`
  height: calc(100vh - 70px);
  margin-left: 5px;

  @media (max-width: ${SM}) {
    margin-left: 0;
  }

  .MuiDrawer-root {
    height: 100%;
  }

  .MuiPaper-root {
    justify-content: space-between;
  }

  .MuiListItemButton-root {
    padding-left: 22px;
  }

  .MuiList-root {
    padding-top: 15px;
  }

  .list-item {
    padding-top: 0;
    padding-bottom: 1px;
    padding-left: 1px;
    padding-right: 1px;
  }
`;

export const FooterWrapper = styled.div`
  .container-content-inset {
    padding: 20px 0 20px 20px;
  }

  .feedback {
    color: ${themeConfig.client.secondary.dark20};
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, 0.87);
  }

  .parko {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.87);
  }
`;

export const NavItem = styled(ListItemButton)`
  height: 45px;
  gap: 15px;
  transition: background-color 0.3s;
  color: rgb(66, 66, 66) !important;

  &.open:has(svg) {
    display: grid !important;
    grid-template-columns: 30px 1fr;
  }

  .nav-icon {
    max-width: 20px !important;
    min-width: 20px !important;
    max-height: 20px;
    justify-content: center;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  span {
    font-size: 14px !important;
  }

  border-radius: 0px 20px 20px 0px !important;

  @media (max-width: ${TB}) {
    border-radius: 0 !important;
    &:has(svg) {
      margin-left: 7px !important;
    }
  }
  
  &:not(:has(.nav-item-text)) {
    border-radius: 20px !important;
    padding-left: 16px;
  }

  &.active {
    background: rgba(42, 106, 231, 0.10);
    color: ${themeConfig.palette.primary.main} !important;
    .MuiListItemIcon-root {
      color: ${themeConfig.palette.primary.main} !important;
    }
  }

  &.notifications {
    .MuiListItemText-primary::after {
      content: "";
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: red;
      position: absolute;
    }
  }

  &:not(.open) {
    justify-content: center;

    .nav-icon {
      justify-content: center;
    }
  }
`;

export const Drawer = styled(DrawerMaterial)`
  .MuiDrawer-paper {
    position: relative !important;
    border: 0 !important;

    @media (max-width: 1024px) {
      .MuiListItem-root {
        padding: 0 0 0 5px;
      }
    }
    @media (max-width: ${TB}) {
      .MuiListItem-root {
        padding: 0;
      }
    }
  }
`;

export const AccordionWrapper = styled(Accordion)`
  box-shadow: unset !important;

  &.Mui-expanded {
    margin: 0 !important;
  }

  &::before {
    display: none !important;
  }

  .MuiButtonBase-root {
    flex-direction: row-reverse;
  }

  .MuiTypography-root {
    display: flex;
    align-items: center;
  }

  .MuiAccordionSummary-root {
    max-height: 45px;
    min-height: 45px;
    padding-left: 0px;
    margin-left: 21px;
    &:has(p) {
      margin-left: 24px;
    }

    .MuiAccordionSummary-expandIconWrapper {
      position: absolute;
      left: -24px;
    }
  }

  .MuiAccordionSummary-root.Mui-expanded {
    min-height: 45px;
  }

  .MuiAccordionSummary-content {
    margin: 10px 0;
    gap: 15px;
    align-items: center;
    
    &:has(p) {
      display: grid;
      grid-template-columns: 30px 1fr;
    }
  }

  .MuiAccordionSummary-content svg {
    fill: #6d6d6d;
  }

  .MuiTypography-root {
    font-size: 14px !important;
    color: #424242;
  }

  .MuiAccordionDetails-root {
    padding: 0;
  }

  .MuiListItemButton-root {
    padding-left: 69px;
  }

  .MuiAccordionSummary-expandIconWrapper.Mui-expanded {
    transform: rotate(270deg);
  }
`;
