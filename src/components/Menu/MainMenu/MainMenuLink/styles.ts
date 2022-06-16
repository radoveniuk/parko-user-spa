import styled from 'styled-components';
import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const StyledMenuButton = styled.button`
  width: 22vw;
  height: 22vw;
  background-color: ${themeConfig.palette.primary.main};
  color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 1.5em;
  border-radius: 2px;
  border: none;
  align-items: center;
  justify-content: center;
  line-height: 30px;
  cursor: pointer;

  transition: background-color 0.3s;

  &:hover {
    background-color: ${themeConfig.palette.primary.light};
  }

  @media (max-width: ${SM}) {
    flex-direction: row-reverse;
    width: 100%;
    margin-top: 25px;
    justify-content: space-around;
  }
`;
