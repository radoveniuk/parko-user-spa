import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const DialogContentWrapper = styled.div`
  .form {
    max-width: 500px;
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 12px;
    
    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
    }

    .fullwidth {
      grid-column: 1 / 3;
    }
    
    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
      .fullwidth {
        grid-column: 1;
      }
    }

    .customSelectOptions {
      .options {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .label {
        color: rgb(113, 113, 113);
        font-size: 14px;
        line-height: 14px;
        border-bottom: 1px solid rgb(214 214 214);
        padding-bottom: 6px;
        margin-bottom: 6px;
      }
    }
  }
`;

export const AddOptionButton = styled.button`
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

export const OptionFieldWrapper = styled.div.attrs({ autoFocus: true })`
  display: flex;
`;

export const OptionField = styled.input.attrs({ autoFocus: true })`
  border: 0;
  height: 36px;
  padding: 0;
  outline: none;
  width: auto;
`;
