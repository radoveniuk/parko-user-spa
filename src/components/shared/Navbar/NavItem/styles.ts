import styled from 'styled-components';
import { colors } from 'theme/colors';

export const NavItemWrapper = styled.div`
  background-color: ${colors.secondary};
  color: #fff;
  min-height: 10vh;
  font-size: 25px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;

  transition: background-color 0.3s;

  &:hover {
    background-color: ${colors.secondaryDark};
  }
`;

export const NavItemText = styled.span`
  margin-left: 24px;
`;

export const NavItemIcon = styled.div`
  margin-left: 12px;
`;
