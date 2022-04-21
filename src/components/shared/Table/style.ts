import styled from 'styled-components';
import { SM } from 'theme/sizeBreakpoints';

export const TableWrapper = styled.div`
  width: 100%;
  height: 400px;

  @media (max-width: ${SM}) {
    display: none;
  }
`;
