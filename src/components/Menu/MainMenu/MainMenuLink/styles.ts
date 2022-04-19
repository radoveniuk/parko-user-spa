import styled from 'styled-components';
import { colors } from 'theme/colors';
import { SM } from 'theme/sizeBreakpoints';

export const StyledMenuButton = styled.button`
  width: 22vw;
  height: 22vw;
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

  transition: background-color 0.3s;

  &:hover {
    background-color: ${colors.primaryLight};
  }

  @media (max-width: ${SM}) {
    flex-direction: row-reverse;
    width: 100%;
    margin-top: 25px;
    justify-content: space-around;
  }
`;
