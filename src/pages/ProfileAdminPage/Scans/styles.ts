import styled from 'styled-components';

export const ScansWrapper = styled.div`
  .upload-new-wrapper {
    display: flex;
    gap: 15px;
    align-items: flex-end;
  }
  .file-grid {
    max-width: min-content;
    grid-template-columns: max-content 1fr 1fr 1fr !important;

    .file-row {
      cursor: default;

      button {
        cursor: default;
        
        &.file-input {
          pointer-events: none;
        }

        &:hover {
          background-color: transparent;
        }
      }
    }
  }
`;
