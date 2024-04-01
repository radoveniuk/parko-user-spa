import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const ProfilesWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #D0D0D0;

  .filter-name {
    max-width: 400px;

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
      max-width: 100%;

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
    grid-template-columns: repeat(6, 1fr);

    .table-settings-wrapper {
      margin-left: auto;
    }

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
  overflow: auto;
  align-items: end;
  border-bottom: 1px solid #e9e9e9;
  gap: 10px;
  padding: 14px 30px;
  @media (max-width: ${TB}) {
    display: none;
  }
`;

export const FilterButton = styled.button`
  height: 36px;
  border-radius: 32px;
  padding: 0 12px;
  cursor: pointer;
  transition: .3s;
  white-space: nowrap;

  &:not(:hover), &:not(:active), &:not(.active) {
    filter: grayscale(1) opacity(0.5);
    border: none;
  }

  &:hover {
    filter: brightness(95%);
  }
`;
