import styled from 'styled-components';

import { themeConfig } from 'theme';

export const ProfileListPageWrapper = styled.div<{ cols: number }>`
  .users-table {
    grid-template-columns: 30px 1fr ${(props) => Array(props.cols).fill('1fr').join(' ')};
  
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
  }

  .table-settings-wrapper {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;

    .cols-settings {
      position: absolute;
      background: #fff;
      z-index: 10;
      padding: 10px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      top: 60px;
      right: 0;
      border-radius: 4px;
      box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
    }
  }

  .container-table {
    width: calc(100% - 370px);
    border: 1px solid ${themeConfig.client.secondary.light10};
    border-radius: 3px;
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
`;

export const FilterTableWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-bottom: 1px solid #e9e9e9;
  gap: 10px;
  padding: 10px 0 10px 35px;
`;
