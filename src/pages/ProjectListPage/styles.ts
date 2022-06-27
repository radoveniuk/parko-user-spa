import styled from 'styled-components';

export const ProjectsListWrapper = styled.div`
  display: flex;

  .projects-list {
    border-right: 1px solid #e9e9e9;
    min-width: 33%;
    max-height: calc(100vh - 190px);
    min-height: calc(100vh - 190px);
    overflow-y: auto;
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
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 10px 10px 10px;
`;

export const ProjectActionsWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

export const DialogContentWrapper = styled.div`

  .actions {
    display: flex;
    justify-content: flex-end;
  }
`;
