import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .users-table > div > div {
    padding-left: 35px;

    @media (max-width: ${TB}) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .users-table div:first-child > div {
    background: #f5f5f5;
  }

  .users-table .col-item svg {
    fill: #212121;
    width: 15px;
    height: 15px;
  }

  .pagination-bottom {
    margin-top: auto;
  }
`;
