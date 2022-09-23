import styled from 'styled-components';

export const ProjectsListWrapper = styled.div`
  display: flex;

  .users-table {
    max-height: calc(100vh - 275px);
  }
`;

export const EmptyDataWrapper = styled.div`
  height: calc(200px);
  font-size: 30px;
  font-weight: 600;
  color: #b9b9b9;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ProjectInfoWrapper = styled.div`
  width: 100%;
`;

export const ProjectInfoDataWrapper = styled.div`
  .project-props {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    margin: 20px 10px 10px 10px;
  }
  
  .project-prop {
    min-width: 300px;
    max-width: 300px;
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
