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

  .permissions {
    height: 50vh;
    overflow: auto;
    padding: 0 2px;

    @media (max-width: ${TB}) {
      height: auto;
    }
  }
`;

export const PermissionSection = styled.div`
  .select-all {
    grid-column: 1 / 3;

    .MuiTypography-root {
      font-weight: 600 !important;
    }
    @media (max-width: ${TB}) {
      grid-column: 1;
    }
  }
    display: grid;
    grid-template-columns: 1fr 1fr;

    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
    }
`;
