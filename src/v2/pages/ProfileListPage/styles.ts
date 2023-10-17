import styled from 'styled-components';

import { themeConfig } from 'theme';
import { PC, TB } from 'theme/sizeBreakpoints';

export const ProfileListPageWrapper = styled.div<{ cols: number }>`
  .users-table {
    grid-template-columns: 30px 1fr ${(props) => Array(props.cols).fill('1fr').join(' ')};
  
    .list-table-cell {
      white-space: nowrap;

      .column-name {
        display: none;

        @media (max-width: ${TB}) {
          display: block;
        }
      }
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
      display: flex;
      flex-direction: column;

      & > div:first-child {
        display: none;
      }

      .list-table-row {
        display: initial;
      }
    }
  }

  .table-settings-wrapper {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;

    .cols-settings {
      position: fixed;
      background: #fff;
      z-index: 10;
      padding: 10px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      right: 60px;
      border-radius: 4px;
      box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
    }
  }

  .container-table {
    border: 1px solid ${themeConfig.client.secondary.light10};
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    flex: auto;
    width: 100%;
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
      padding: 3px 0 !important;
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
  }

  @media (max-width: ${PC}) {
    .stack-profile .container-table { 
      display: flex !important;
      max-width: calc(100% - 30px);
      /* width: calc(100% - 30px); */
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
  align-items: center;
  border-bottom: 1px solid #e9e9e9;
  gap: 10px;
  padding: 10px 0 10px 35px;
`;
