import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const ClientsListWrapper = styled.div`
  @media (min-width: ${SM}) {
    display: flex;
  }

  .clients-list {
    max-height: calc(100vh - 175px);

    @media (max-width: ${SM}) {
      display: none;
    }
  }
`;
