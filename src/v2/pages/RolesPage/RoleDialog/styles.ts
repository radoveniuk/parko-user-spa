import styled from 'styled-components';

import { SM, TB } from 'theme/sizeBreakpoints';

export const DialogContentWrapper = styled.div`
  .form {
    display: grid;
    gap: 16px;
    grid-template-columns: 250px 250px;
    margin-bottom: 12px;
    
    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
    }

    .fullwidth {
      grid-column: 1 / 3;
    }
    
    @media (max-width: ${SM}) {
      grid-template-columns: 1fr;
      .fullwidth {
        grid-column: 1;
      }
    }
  }
`;
