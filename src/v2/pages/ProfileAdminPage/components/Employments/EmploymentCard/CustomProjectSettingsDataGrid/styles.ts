import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const CustomProjectSettingsDataGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  max-width: max-content;
  margin: 0 auto;

  @media (max-width: ${TB}) {
    align-items: initial;
    max-width: 100%;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
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
    
        .delete-btn {
          position: absolute;
          right: -35px;
          top: 2px;
        }
      }
    }
  }

  .actions {
    display: flex;
    gap: 6px;
    margin-left: auto;
  }
`;
