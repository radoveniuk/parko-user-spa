import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const PrepaymentDialogContent = styled.div`
  .form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    row-gap: 12px;
    margin-bottom: 48px;
    
    .fullwidth {
      grid-column: 1 / 3;
    }

    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
      width: 100%;
      *:last-child {
        grid-column: 1;
      }
      .fullwidth {
        grid-column: 1;
      }
    }
  }
`;
