import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const ProjectsListWrapper = styled.div`
  display: flex;

  .projects-list {
    max-height: calc(100vh - 175px);
    overflow: auto;
    @media (min-width: ${SM}) {
      min-width: 300px;
      max-width: 300px;
    }
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
