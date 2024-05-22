import styled from 'styled-components';
import { DialogActions } from 'v2/uikit/Dialog';

import { TB } from 'theme/sizeBreakpoints';

export const DialogContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 242px 470px;
  .userSettings {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-right: 1px solid #d0d0d0;
    padding: 2px 12px 2px 1px;
    max-height: 400px;
    overflow-y: auto;

    .userCard {
      padding: 15px 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: #fafafa;
      border-radius: 5px;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px;

      .MuiInputBase-root {
        max-width: 200px;
      }
    }
  }

  .docSettings {
    margin-bottom: 12px;
    margin-left: 12px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    overflow: auto;
    justify-content: flex-start;
    height: min-content;
    align-items: center;
    max-height: 305px;

    &:not(.categories) {
      border-top: 1px solid #d0d0d0;
      padding-top: 12px;
      padding-bottom: 12px;
    }

    .card {
      display: grid;
      grid-template-columns: 24px 1fr;
      transition: .3s;
      padding-left: 16px;
      min-width: 200px;
      width: 200px;
      align-items: center;
      gap: 16px;
      background: #f0f4f9;
      color: rgb(60, 64, 67);
      height: 50px;
      border-radius: 0.375rem;
      cursor: pointer;

      .text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: calc(100% - 10px);
      }

      &:hover {
        background-color: #dfe3e7;
      }
      &.active {
        background-color: #bdc0c3;
      }
    }
  }

  @media (max-width: ${TB}) {
    grid-template-columns: 1fr;

    .userSettings {
      .MuiInputBase-root {
        max-width: 100% !important;
      }
      border-right: none;
      padding: 1px;
      max-height: 100%;
    }

    .docSettings {
      margin-left: 0;
      margin-top: 12px;
      flex-wrap: nowrap;
      flex-direction: column;
      max-height: 100%;
      overflow: hidden;

      &.categories:first-child {
        flex-direction: row;
      }

      .card {
        width: calc(100% - 16px);
      }
    }
  }
`;

export const PrintDocDialogActions = styled(DialogActions)`
  align-items: flex-end !important;

  @media (max-width: ${TB}) {
    flex-direction: column;
    gap: 12px;

    .signDatepicker {
      width: 100%;
    }
  }
`;
