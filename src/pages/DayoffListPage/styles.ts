import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const CommentDialogWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  p {
    margin: 0;
  }

  .dates {
    gap: 5px;
    display: flex;
  }
`;

export const DayoffFormWrapper = styled.div`
  display: grid;
  grid-template-columns: 300px;
  grid-gap: 10px;
  padding: 15px;
  
  @media (min-width: ${SM}) {
    grid-template-columns: 300px 300px;
  }
`;
