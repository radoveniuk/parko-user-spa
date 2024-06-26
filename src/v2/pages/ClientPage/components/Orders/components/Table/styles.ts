import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .orders-table {
    overflow: scroll;
    max-height: calc(100vh - 373px);
    position: relative;

    @media (max-width: ${TB}) {
      max-height: calc(100vh - 255px);
    }
  }

  .orders-table > div > div {
    padding-left: 35px;

    @media (max-width: ${TB}) {
      padding-left: 5px;
    }
  }

  .orders-table div:first-child > .list-table-cell {
    background: #f5f5f5;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .orders-table .col-item svg {
    fill: #212121;
    width: 15px;
    height: 15px;
  }

  .pagination-bottom {
    margin-top: auto;
  }
`;
