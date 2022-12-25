import styled from 'styled-components';

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
`;
