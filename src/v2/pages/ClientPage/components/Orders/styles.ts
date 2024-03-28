import styled from 'styled-components';

import { PC, TB } from 'theme/sizeBreakpoints';

export const OrdersWrapper = styled.div`
    padding-right: 2px;
  .orders-table {
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
    border: 1px solid #D0D0D0;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    flex: auto;
    width: 100%;

    @media (max-width: ${TB}) {
      box-shadow: none;
    }
  }

  .filter-name {
    max-width: 400px;
    max-width: 100%;
    .MuiOutlinedInput-root {
      /* border-radius: 40px; */
    }

    .MuiAutocomplete-popupIndicator {
      display: none;
    }

    .MuiInputBase-input {
      height: 25px;
      padding: 3px 5px !important;
    }

    .MuiAutocomplete-inputRoot {
      padding: 5px 9px;
    }

    .MuiAutocomplete-tag {
      font-size: 12px;
      height: 25px;

      svg {
        width: 14px;
      }
    }

    .search-icon {
      width: 20px;
      height: 20px;
    }
    @media (max-width: ${TB}) {
      width: 100%;

      .MuiFormLabel-root {
        display: none;
      }
      .MuiOutlinedInput-root {
        border-radius: 0;
      }
      .MuiOutlinedInput-notchedOutline {
        border-color: transparent !important;
      }
      .MuiInputBase-input {
        height: 25px;
        padding: 10px !important;
      }
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
    .pagination-bottom, .orders-table {
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
  border-bottom: 1px solid #e9e9e9;
  gap: 10px;
  padding: 14px 30px;
  overflow-y: auto;

  @media (max-width: ${TB}) {
    display: none;
  }
`;
