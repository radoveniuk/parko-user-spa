import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const ClientsListWrapper = styled.div`
  display: flex;

  .clients-list {
    max-height: calc(100vh - 175px);
    overflow: auto;

    @media (min-width: ${SM}) {
      min-width: 300px;
    }
  }
`;
