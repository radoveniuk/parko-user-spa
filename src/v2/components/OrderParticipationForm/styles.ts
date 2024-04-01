import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 24px;
  row-gap: 12px;
  margin-bottom: 12px;
  max-width: 600px;
  
  .fullwidth {
    grid-column: 1 / 3;
  }

  @media (max-width: ${TB}) {
    grid-template-columns: 1fr;
    width: 100%;

    .fullwidth {
      grid-column: 1;
    }
  }
`;

export const InfoWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #D0D0D0;
  background: #FAFAFA;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px 20px;
  position: relative;

  .toggle-view {
    position: absolute;
    right: 5px;
    top: 5px;
  }

  .info {
    margin-top: 6px;
    color: #717171;
    font-size: 14px;
    &.hide {
      display: none;
    }
    .actions {
      margin-top: 6px;
    }
  }
`;

export const StagesTable = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  width: calc(100%);
  font-size: 14px;
  margin-bottom: 12px;

  thead {
    th {
      font-weight: 500;
      color: #717171;
      text-align: left;
    }
  }

  tbody {
    tr td {
      border-right: 1px solid #D0D0D0;
      border-bottom: 1px solid #D0D0D0;
      padding: 8px;
      background: #F3F3F3;
      position: relative;
      transition: .2s;

      .edit-btn {
        position: absolute;
        right: 1px;
        top: 1px;
        opacity: 0;
        transition: .2s;
      }
    }

    tr:hover {
      td {
        background: #ececec;
      }
      .edit-btn {
        opacity: 0.9;
      }
    }

    tr td:first-child {
      border-left: 1px solid #D0D0D0;
    }
    tr:first-child td {
      text-align: left;
      border-top: solid 1px #D0D0D0;
    }
    
    tr:first-child td:first-child {
      border-top-left-radius: 6px;
    }

    tr:first-child td:last-child {
      border-top-right-radius: 6px;
    }

    tr:last-child td:first-child {
      border-bottom-left-radius: 6px;
    }

    tr:last-child td:last-child {
      border-bottom-right-radius: 6px;
    }
  }
`;

export const ReadonlyExpirience = styled.div`
  .title {
    .company {
      display: inline;
      text-decoration: underline;
    }
  }

  .data {
    margin: 0;
    padding-inline-start: 20px;
  }
`;
