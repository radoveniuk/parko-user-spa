import styled from 'styled-components';

export const ScansWrapper = styled.div`
  .upload-new-wrapper {
    display: flex;
    gap: 15px;
    align-items: flex-end;
  }

  .file-input-wrapper {
    margin: 20px 0;
  }
  
  .file-grid {
    max-width: min-content;
    grid-template-columns: max-content 1fr 1fr 1fr 1fr 1fr 1fr !important;

    .file-row {
      cursor: default;
        .file-input {
          cursor: pointer;
          &:hover {
            background-color: rgba(0, 0, 0, 0.04);
            border-radius: 50%;
          }
          button {
            pointer-events: none;
          }
        }
      
    }
  }
`;
