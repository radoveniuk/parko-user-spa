import { Menu, MenuItem, ProSidebar } from 'react-pro-sidebar';
import styled, { css } from 'styled-components';
import { colors } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const IconWrapper = styled.div`
  margin-left: 10px;
  display: none !important;
  @media (max-width: ${SM}) {
    display: flex !important;
    align-items: center;
  }
`;

export const NavbarWrapper = styled.div`
  max-width: 400px;
  position: relative;
`;

export const StyledNavbar = styled(ProSidebar)`
  background-color: ${colors.navBackground};
  height: calc(100vh) !important;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;

  .pro-sidebar-inner {
    background-color: transparent !important;
    padding-top: 90px;
  }

  .overlay {
    background-color: transparent;
  }
  
  @media (max-width: ${SM}) {
    width: auto;
    ${props => props.toggled && css`
      width: 100vw;
    `}
  }
`;

export const NavbarMenu = styled(Menu)`
  background-color: ${colors.navBackground};
  padding-top: 0 !important;
  padding-bottom: 0 !important;
`;

export const NavItem = styled(MenuItem)`
  background-color: ${colors.secondary};
  color: #fff;
  font-size: 25px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;

  transition: background-color 0.3s;

  &:hover {
    background-color: ${colors.secondaryDark};
  }

  ${props => props.active && css`
    background-color: ${colors.secondaryDark};
  `}

  .pro-inner-item {
    width: 100%;
    min-height: 8vh;

    .pro-icon-wrapper {
      background-color: transparent !important;
    }
  
    .pro-item-content {
      font-size: 18px;
    }
  }

  @media (max-width: ${SM}) {
    margin: 20px;
    width: auto;
  }
`;
