import styled from 'styled-components';

export const ClientInfoWrapper = styled.div`
  flex-grow: 1;
  margin-left: 10px;

  .table-actions {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  .users-table {
    max-height: calc(100vh - 353px);
    grid-template-columns: 30px 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  .table-settings {
    margin-left: auto;
  }
`;
