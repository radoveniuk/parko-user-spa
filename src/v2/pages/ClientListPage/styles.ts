import styled from 'styled-components';

import { themeConfig } from 'theme';
import { PC, TB } from 'theme/sizeBreakpoints';

export const ProfileListPageWrapper = styled.div<{ cols: number }>`
  .users-table {
    .list-table-cell {
      white-space: nowrap;
    }

    .fast-edit-profile {
      opacity: 0;
      transition: .3s;
      margin-left: auto;
      margin-right: 10px;

      &.active {
        opacity: 1;
      }
    }
    
    .list-table-row:hover {
      .fast-edit-profile {
        opacity: 1;
      }
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

  .table-settings-wrapper {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;

    @media (max-width: ${TB}) {
      display: none;
    }
  }

  .container-table {
    margin-top: 18px;
    border: 1px solid ${themeConfig.client.secondary.light10};
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    flex: auto;
    width: 100%;
  }

  .clear-filter, .AddFilterButton {
    @media (max-width: ${TB}) {
      display: none;
    }
  }

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