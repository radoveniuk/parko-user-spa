import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const UpdateHistoryWrapper = styled.div`
  @media (max-width: 1040px) {
    thead {
      display: none;
    }

    tbody {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    tr {
      padding: 12px 6px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      position: relative;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
      background-color: #fff;
      width: calc(100% - 30px);
    }

    td {
      border-bottom: none !important;

      &.date {
        font-size: 11px !important;
        color: #7e7e7e;
        position: absolute;
        right: 6px;
        top: 6px;
      }

      &.description {
        max-width: calc(100vw - 45px);
        overflow: auto;
      }
    }
  }
`;

export const AccountLink = styled.div`
  display: flex;
  align-items: center;
  padding-top: 6px;
  padding-bottom: 6px;
  gap: 6px;
  color: inherit;

  .MuiAvatar-root {
    height: 30px;
    width: 30px;
    font-size: 1.1rem;
  }
`;

export const UpdateRow = styled.span`
  color: #7e7e7e;
  font-size: 12px;
`;

export const OldValue = styled.s`
  color: #935555;
  font-weight: 600;

  @media (max-width: ${TB}) {
    font-weight: 500;
    font-size: 12px;
  }
`;

export const NewValue = styled.span`
  color: #4c9153;
  font-weight: 600;

  @media (max-width: ${TB}) {
    font-weight: 500;
    font-size: 12px;
  }
`;
export const DocItems = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  margin-top: 6px;

  @media (max-width: ${TB}) {
    flex-wrap: wrap;
  }
`;

export const DocItem = styled.div`
  padding: 6px;
  font-size: 11px;
  border-radius: 5px;
  border: 1px solid #D0D0D0;
  background: #fafafa;
  width: 140px;
  max-width: 140px;
  &.old {
    border-top: 3px solid #935555;
  }
  &.new {
    border-top: 3px solid #4c9153;
  }

  .title {
    font-weight: 600;
  }

  .fields {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 6px;
  }

  .field {
    color: rgb(126, 126, 126);
    .fieldTitle {
      font-size: 10px;
      width: 60px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .fieldValue {
      font-weight: 600;
      width: 60px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
`;
