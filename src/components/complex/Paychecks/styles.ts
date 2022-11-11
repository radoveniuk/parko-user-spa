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

export const EmptyDataWrapper = styled.div`
  height: calc(100vh - 165px);
  font-size: 30px;
  font-weight: 600;
  color: #b9b9b9;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;
