import styled from 'styled-components';

export const UploadedPaychecksWrapper = styled.div`
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

  .list-table-cell {
    white-space: nowrap;
  }
`;
