import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const DialogContentWrapper = styled.div`
  .form {
    max-width: 500px;
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr;
    
    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
      padding-right: 8px;
    }
  }
  
  .fields {
    .label {
      color: rgb(113, 113, 113);
      font-size: 14px;
      line-height: 14px;
      border-bottom: 1px solid rgb(214 214 214);
      padding-bottom: 6px;
      margin-bottom: 6px;
      margin-top: 6px;
      margin-right: 8px;
    }

    
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 253px);
      align-items: center;

      @media (max-width: ${TB}) {
        &:first-child {
          grid-template-columns: 1fr;
          gap: 12px;
        }
      }

      .row {
        @media (max-width: ${TB}) {
          &:first-child {
            display: none;
          }
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-radius: 5px;
          box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px;
          padding: 15px 20px;
          .delete-btn {
            position: absolute;
            right: 0;
            top: 0;
          }
        }
        @media (min-width: ${TB}) {
          display: contents;
    
          &:last-child {
            .cell:not(:first-child) {
              .MuiInputBase-root {
                border-bottom-left-radius: 0;
              }
            }
            .cell:not(:last-child) {
              .MuiInputBase-root {
                border-bottom-right-radius: 0;
              }
            }
          }
      
          &:nth-child(2) {
            .cell:not(:first-child) {
              .MuiInputBase-root {
                border-top-left-radius: 0;
              }
            }
            .cell:not(:last-child) {
              .MuiInputBase-root {
                border-top-right-radius: 0;
              }
            }
          }
      
          &:not(:last-child) {
            .MuiInputBase-root {
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;
            }
            .MuiInputBase-root:not(.Mui-focused):not(.Mui-error):not(:hover) {
              fieldset {
                border-bottom-color: transparent;
              }
            }
          }
      
          &:not(:nth-child(2)) {
            .MuiInputBase-root {
              border-top-left-radius: 0;
              border-top-right-radius: 0;
            }
          }
    
          .cell {
            position: relative;
            min-width: 253px;
            &.header {
              color: #717171;
              font-size: 0.875rem;
              margin-bottom: 3px;
            }
            .label {
              display: none;
            }
      
            .border-right:not(:has(.Mui-focused)):not(.Mui-focused):not(:has(.Mui-error)):not(.Mui-error):not(:hover) {
              fieldset {
                border-right-color: transparent;
              }
            }
          }
      
          .actions {
            position: absolute;
            right: -76px;
            top: 2px;
            display: flex;
            gap: 6px;
          }
        }
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
