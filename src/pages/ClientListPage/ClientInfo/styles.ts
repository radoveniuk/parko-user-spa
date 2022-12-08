import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const ClientInfoWrapper = styled.div`
  flex-grow: 1;
  margin-left: 10px;
  position: relative;
  max-width: 100%;

  .table-actions {
    display: flex;
    align-items: center;
    margin-left: auto;
    position: absolute;
    top: 5px;
    right: 5px;
    @media (max-width: ${SM}) {
      position: static;
      margin-top: 5px;
    }
  }

  .projects-table {
    grid-template-columns: 30px 1fr 1fr 1fr;
  }

  .users-table {
    max-height: calc(100vh - 353px);
    grid-template-columns: 30px 1fr 1fr 1fr 1fr 1fr 1fr;
    @media (max-width: ${SM}) {
      max-height: none;
    }
  }

  .table-settings {
    margin-left: auto;
  }
`;
