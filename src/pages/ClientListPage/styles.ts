import styled from 'styled-components';

import { SM, TB } from 'theme/sizeBreakpoints';

export const ClientsListWrapper = styled.div`
  @media (min-width: ${SM}) {
    display: flex;
  }
  @media (min-width: ${TB}) {
    display: grid;
    grid-template-columns: 300px 1fr;
  }

  .clients-list {
    max-height: calc(100vh - 175px);
    overflow: auto;

    @media (max-width: ${SM}) {
      display: none;
    }
  }
`;
