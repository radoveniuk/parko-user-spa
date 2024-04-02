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
    }
  }
  
  .fields {
    .label {
      color: rgb(113, 113, 113);
      font-size: 14px;
      line-height: 14px;
      margin-bottom: 6px;
      margin-top: 6px;
      
      &.separated {
        border-bottom: 1px solid rgb(214 214 214);
        padding-bottom: 6px;
        margin-right: 8px;
      }
    }
    
    .grid {
      display: flex;
      flex-direction: column;

      .row {
        display: flex;
        align-items: center;

        @media (min-width: ${TB}) {
          &:not(:nth-child(2)) {
            .cell {
              .MuiInputBase-root {
                border-top-right-radius: 0 !important;
                border-top-left-radius: 0 !important;
                &:not(.Mui-focused):not(.Mui-error):not(:hover) {
                  fieldset {
                    border-top-color: transparent;
                  }
                }
              }
            }
          }
          &:not(:last-child) {
            .cell {
              .MuiInputBase-root {
                border-bottom-right-radius: 0 !important;
                border-bottom-left-radius: 0 !important;
              }
            }
          }
          .cell {
            width: 253px;
  
            .label {
              display: none;
            }
  
            &:first-child {
              .MuiInputBase-root {
                border-top-right-radius: 0 !important;
                border-bottom-right-radius: 0 !important;
                &:not(.Mui-focused):not(.Mui-error):not(:hover) {
                  fieldset {
                    border-right-color: transparent;
                  }
                }
              }
            }
            &:nth-child(2) {
              .MuiInputBase-root {
                border-top-left-radius: 0 !important;
                border-bottom-left-radius: 0 !important;
              }
            }
          }
  
          .actions {
            gap: 6px;
            margin-left: 6px;
            display: flex;
          }
        }

        @media (max-width: ${TB}) {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-radius: 5px;
          box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px;
          padding: 15px 20px;
          position: relative;
          margin-top: 12px;
          background-color: #fff;

          &:first-child {
            display: none;
          }
          .cell {
            width: 100%;
          }

          .actions {
            gap: 3px;
            display: flex;
            position: absolute;
            right: 0;
            top: 0;
            width: max-content;
          }
        }

      }
    }
  }
`;
