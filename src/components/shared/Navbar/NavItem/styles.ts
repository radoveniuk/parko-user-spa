import styled from 'styled-components';
import { colors } from 'theme/colors';

export const NavItemWrapper = styled.div`
  background-color: ${colors.secondary};
  color: #fff;
  min-height: 10vh;
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  transition: background-color 0.3s;

  &:hover {
    background-color: ${colors.secondaryDark};
  }
`;
