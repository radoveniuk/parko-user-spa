import styled from 'styled-components';

export const ExportProfilesWrapper = styled.div`  
  display: flex;
  flex-direction: column;

  .profiles-grid {
    max-height: calc(100vh - 150px);
  }

  .fast-actions {
    display: flex;
    gap: 10px;
    margin-left: 10px;
  }
`;
