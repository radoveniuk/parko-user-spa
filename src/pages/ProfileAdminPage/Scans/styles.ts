import styled from 'styled-components';

export const ScansWrapper = styled.div`
  .upload-new-wrapper {
    display: flex;
    gap: 15px;
    align-items: flex-end;
  }
  .file-grid {
    max-width: min-content;

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

export const DeleteModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;
