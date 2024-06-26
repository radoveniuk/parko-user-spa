import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .users-table {
    transition: .3s;
    overflow: scroll;
    max-height: calc(100vh - 290px);
    position: relative;

    &.expand {
      max-height: calc(100vh - 199px);
    }

    @media (max-width: ${TB}) {
      max-height: calc(100vh - 255px);
    }
  }

  .users-table > div > div {
    padding-left: 35px;

    @media (max-width: ${TB}) {
      padding-left: 5px;
    }
  }

  .users-table div:first-child > .list-table-cell {
    background: #f5f5f5;
    position: sticky;
    top: 0;
    z-index: 1;
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
