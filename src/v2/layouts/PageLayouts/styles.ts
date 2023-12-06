import styled from 'styled-components';

import { PC, SM } from 'theme/sizeBreakpoints';

export const MainWrapper = styled.main`
  position: relative;
  width: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding-right: 12px;
  padding-bottom: 12px;

  @media (min-width: ${PC}) {
    padding: 0 25px;
  }

  @media (max-width: ${SM}) {
    padding: 0;
  }
`;
