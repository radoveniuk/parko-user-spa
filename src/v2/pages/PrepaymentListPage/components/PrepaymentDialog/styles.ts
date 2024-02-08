import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const PrepaymentDialogContent = styled.div`
  .form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    row-gap: 12px;
    margin-bottom: 48px;

    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
      *:last-child {
        grid-column: 1;
      }
    }
  }
`;
