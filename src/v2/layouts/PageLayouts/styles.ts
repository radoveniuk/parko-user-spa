import styled from 'styled-components';

import { PC, TB } from 'theme/sizeBreakpoints';

export const MainWrapper = styled.main`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-right: 12px;
  padding-bottom: 12px;
  
  @media (min-width: ${PC}) {
    padding: 0 25px;
  }

  @media (max-width: ${TB}) {
    padding: 0;
  }

  @media (min-width: ${TB}) {
    overflow-y: auto;
  }
`;
