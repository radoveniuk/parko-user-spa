import styled from 'styled-components';
import { colors } from 'theme/colors';

export const StyledMenuButton = styled.button`
  width: 288px;
  height: 288px;
  background-color: ${colors.primary};
  color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 30px;
  border-radius: 2px;
  border: none;
  align-items: center;
  justify-content: center;
  line-height: 30px;
  cursor: pointer;
`;
