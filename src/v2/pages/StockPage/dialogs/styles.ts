import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const DialogContentWrapper = styled.div`
  margin-bottom: 12px;
  position: relative;
  .form {
    display: grid;
    grid-template-columns: 250px 250px;
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
  `;

export const LoaderWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff9e;
`;
