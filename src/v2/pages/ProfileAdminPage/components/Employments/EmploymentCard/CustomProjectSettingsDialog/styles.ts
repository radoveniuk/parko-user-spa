import styled from 'styled-components';

export const SettingsWrapper = styled.div`
  .settings-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    .cell {
      &.header {
        color: #717171;
        font-size: 0.875rem;
        margin-bottom: 3px;
      }
      .label {
        display: none;
      }
    }

    .cell:not(:nth-child(3)) {
      .MuiInputBase-root {
        border-top-left-radius: 0;
      }
    }
    .cell:not(:nth-child(4)) {
      .MuiInputBase-root {
        border-top-right-radius: 0;
      }
    }
    .cell:not(:nth-last-child(2)) {
      .MuiInputBase-root {
        border-bottom-left-radius: 0;
      }
    }
    .cell:not(:nth-last-child(1)) {
      .MuiInputBase-root {
        border-bottom-right-radius: 0;
      }
    }

    .cell:not(:nth-last-child(1)):not(:nth-last-child(2)) {
      .MuiInputBase-root:not(.Mui-focused):not(:hover) {
        fieldset {
          border-bottom-color: transparent;
        }
      }
    }
    .cell:nth-child(odd) {
      .MuiInputBase-root:not(.Mui-focused):not(:hover) {
        fieldset {
          border-right-color: transparent;
        }
      }
    }

    .MuiInputBase-root {
      transition: background-color .4s;
    }

    .highlited {
      &.MuiInputBase-root, .MuiInputBase-root {
        background-color: #d3d9f8;
      }
    }
  }
`;
