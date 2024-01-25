import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const ProfilesWrapper = styled.div<{cols: number }>`
  border-radius: 5px;
  border: 1px solid #D0D0D0;

  .filter-name {
    max-width: 400px;
    .MuiOutlinedInput-root {
      border-radius: 40px;
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

  .users-table {
    grid-template-columns: 30px 1fr ${(props) => Array(props.cols).fill('1fr').join(' ')};

    .table-settings-wrapper {
      margin-left: auto;
    }

    .list-table-cell {
      white-space: nowrap;
    }

    @media (max-width: ${TB}) {
      grid-template-columns: 30px 1fr 1fr;
      .list-table-cell:has(.fast-edit-profile), .list-table-cell:has(.table-settings-wrapper) {
        display: none;
      }

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

  @media (max-width: ${TB}) {
    border: none;
    .pagination-bottom, .users-table {
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
  flex-wrap: wrap;
  align-items: end;
  border-bottom: 1px solid #e9e9e9;
  gap: 10px;
  padding: 14px 30px;
  @media (max-width: ${TB}) {
    padding: 0;
  }

  .filter-chip {
    height: 36px;
    @media (max-width: ${TB}) {
      display: none;;
    }
  }
`;
