import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const ApproveDialogWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  p {
    margin: 0;
  }

  .actions {
    gap: 5px;
    display: flex;
    justify-content: center;
  }
`;

export const PrepaymentFormWrapper = styled.div`
  display: grid;
  grid-template-columns: 300px;
  grid-gap: 10px;
  padding: 15px;
  
  @media (min-width: ${SM}) {
    grid-template-columns: 300px 300px;
  }
`;
