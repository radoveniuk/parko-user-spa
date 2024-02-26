import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .daysoff-table {
    overflow: scroll;
    max-height: calc(100vh - 310px);
    position: relative;

    @media (max-width: ${TB}) {
      max-height: calc(100vh - 255px);
    }

    .list-table-cell:has(li) {
      .doc-list {
        max-height: 30px;
        overflow-y: auto;
        overflow-x: hidden;
        margin: 0;
        padding: 0;
        list-style: none;
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
  }

  .daysoff-table > div > div {
    padding-left: 35px;

    @media (max-width: ${TB}) {
      padding-left: 5px;
    }
  }

  .daysoff-table div:first-child > .list-table-cell {
    background: #f5f5f5;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .daysoff-table .col-item svg {
    fill: #212121;
    width: 15px;
    height: 15px;
  }

  .pagination-bottom {
    margin-top: auto;
  }
`;
