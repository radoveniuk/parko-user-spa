import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const DialogContentWrapper = styled.div`
  .form {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr;

    
    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
    }
  }
`;
