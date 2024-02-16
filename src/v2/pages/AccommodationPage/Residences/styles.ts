import styled from 'styled-components';

import { PC, TB } from 'theme/sizeBreakpoints';

export const ResidencesWrapper = styled.div`
  .residences-table {
    .list-table-cell {
      white-space: nowrap;
    }

    @media (max-width: ${TB}) {
      grid-template-columns: 30px 1fr 1fr;

      .list-table-cell .column-content {
        width: 160px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        color: inherit !important;
      }
      .column-content {
        color: inherit !important;
      }
    }
  }

  .container-table {
    margin-top: 6px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.20), 0px 2px 1px -1px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14);
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    flex: auto;
    width: 100%;

    @media (max-width: ${TB}) {
      box-shadow: none;
    }
  }

  @media (max-width: ${PC}) {
    .stack-profile .container-table { 
      display: flex !important;
      max-width: calc(100% - 30px);
    }

    .stack-profile.hide .container-table {
      display: none !important;
    }

    .stack-profile .filters {
      max-width: 0;
    }

    .stack-profile.hide .filters {
      max-width: 100%;
    }
  }

  @media (max-width: ${TB}) {
    .pagination-bottom, .residences-table {
      display: none;
    }
  }

  .mobile-list {
    display: none;
    @media (max-width: ${TB}) {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  }
`;

export const FilterTableWrapper = styled.div`
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  align-items: end;
  border-bottom: 1px solid #e9e9e9;
  gap: 10px;
  padding: 14px 30px;
  @media (max-width: ${TB}) {
    display: none;;
  }
`;
