import styled from 'styled-components';

export const CustomProjectSettingsDataGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  max-width: max-content;
  margin: 0 auto;

  .grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;

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

      .border-right:not(:has(.Mui-focused)):not(.Mui-focused):not(:hover) {
        fieldset {
          border-right-color: transparent;
        }
      }
    }

    .cell:not(:nth-last-child(1)):not(:nth-last-child(2)):not(:nth-last-child(3)):not(:nth-last-child(4)):not(:nth-last-child(5)) {
      .MuiInputBase-root:not(.Mui-focused):not(:hover) {
        fieldset {
          border-bottom-color: transparent;
        }
      }
    }

    .cell:not(:nth-child(6)) {
      .MuiInputBase-root {
        border-top-left-radius: 0;
      }
    }
    .cell:not(:nth-child(10)) {
      .MuiInputBase-root {
        border-top-right-radius: 0;
      }
    }
    .cell:not(:nth-last-child(5)) {
      .MuiInputBase-root {
        border-bottom-left-radius: 0;
      }
    }
    .cell:not(:nth-last-child(1)) {
      .MuiInputBase-root {
        border-bottom-right-radius: 0;
      }
    }

    .delete-btn {
      position: absolute;
      right: -35px;
      top: 2px;
    }
  }

  .actions {
    display: flex;
    gap: 6px;
    margin-left: auto;
  }
`;
