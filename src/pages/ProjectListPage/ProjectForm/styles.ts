import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const ProjectFormWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 330px);
  min-height: 600px;

  @media (max-width: ${SM}) {
    max-height: none;
  }
`;

export const AccordionFieldsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(min-content, 200px));
  grid-gap: 20px;

  .textarea {
    grid-column-start: 1;
    grid-column-end: 4;
  }

  @media (max-width: ${SM}) {
    grid-template-columns: 1fr;
    .textarea {
      grid-column-start: 1;
      grid-column-end: 2;
    }
  }
`;
