import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const OrderDialogContent = styled.div`
  .form {
    display: grid;
    grid-template-columns: repeat(2, 250px);
    column-gap: 24px;
    row-gap: 12px;
    margin-bottom: 12px;
    
    .fullwidth {
      grid-column: 1 / 3;
    }

    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
      width: 100%;
      *:last-child {
        grid-column: 1;
      }
      .fullwidth {
        grid-column: 1;
      }
    }
  }

  .stages {
    margin-bottom: 12px;
    max-width: 524px;
    position: relative;
    .label {
      color: rgb(113, 113, 113);
      font-size: 14px;
      margin-bottom: 6px;
      margin-top: 6px;
      border-bottom: 1px solid rgb(214 214 214);
      padding-bottom: 6px;
    }
    .options {
      display: flex;
      gap: 6px;
      margin-bottom: 6px;
      width: 100%;
      max-width: 524px;
      overflow-x: scroll;
      padding-bottom: 6px;
    }
  }
`;

export const AddStageButton = styled.button`
  outline: none;
  border: none;
  width: 36px;
  height: 36px;
  background: #E7E7E7;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  transition: .3s;
  &:hover {
    background: #d3d3d3;
  }
  &:disabled {
    background: #F3F3F3;
    cursor: default;
    pointer-events: none;
  }
`;

export const StageNameFieldWrapper = styled.div.attrs({ autoFocus: true })`
  display: flex;
`;

export const StageNameField = styled.input.attrs({ autoFocus: true })`
  border: 0;
  height: 36px;
  padding: 0;
  outline: none;
  width: auto;
`;
