import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const DialogContentWrapper = styled.div`
  padding: 10px;
  .form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 12px;
    row-gap: 6px;

    .fullwidth {
      grid-column: 1 / 3;
    }

    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
      .fullwidth {
        grid-column: 1;
      }
    }
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
    align-items: center;

    button {
      height: 36px;
    }
  }
`;
