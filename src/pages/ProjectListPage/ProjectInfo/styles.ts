import styled from 'styled-components';

export const ProjectInfoWrapper = styled.div`
  flex-grow: 1;
  margin-left: 10px;

  .table-actions {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  .users-table {
    max-height: calc(100vh - 390px);
    grid-template-columns: 30px 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  .table-settings {
    margin-left: auto;
  }
`;

export const ProjectInfoDataWrapper = styled.div`
  display: flex;
  max-height: calc(100vh - 280px);
  overflow-x: auto;
  
  .project-props {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    margin: 20px 10px 10px 10px;
    flex-grow: 2;
  }
  
  .project-prop {
    min-width: 300px;
    max-width: 300px;
  }

  .project-client {
    padding: 30px;
    flex-grow: 1;
  }
`;
export const ProjectActionsWrapper = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

export const DialogContentWrapper = styled.div`

  .actions {
    display: flex;
    justify-content: flex-end;
  }
`;
