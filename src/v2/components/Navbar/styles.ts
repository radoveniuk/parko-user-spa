import { Accordion, Box, Drawer as DrawerMaterial, ListItemButton } from '@mui/material';
import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

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
  color: #000;
  transition: background-color 0.3s;
  color: #000 !important;

  .nav-icon {
    max-width: 20px !important;
    min-width: 20px !important;
    max-height: 20px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  span {
    font-size: 14px !important;
  }

  border-radius: 0px 20px 20px 0px !important;
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
      background-color: #fff;
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
  }

  .MuiAccordionSummary-root.Mui-expanded {
    min-height: 45px;
  }

  .MuiAccordionSummary-content {
    margin: 10px 0;
    gap: 15px;
    align-items: center;
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
    padding-left: 57px;
  }

  .MuiAccordionSummary-expandIconWrapper.Mui-expanded {
    transform: rotate(270deg);
  }
`;
