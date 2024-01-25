import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const SalaryFormWrapper = styled.form`
  .inputs {
    display: grid;
    grid-gap: 25px;
    grid-template-columns: 200px 200px;
  
    div:last-child {
      grid-column-start: 1;
      grid-column-end: 3;
    }

    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
      div:last-child {
        grid-column-start: 1;
        grid-column-end: 2;
      }
    }
  }

  .button {
    margin-top: 15px;
  }
`;
