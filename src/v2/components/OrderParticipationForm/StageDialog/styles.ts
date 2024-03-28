import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 250px);
  column-gap: 24px;
  row-gap: 12px;
  margin-bottom: 12px;
  max-width: 600px;
  
  .fullwidth {
    grid-column: 1 / 3;
  }

  @media (max-width: ${TB}) {
    grid-template-columns: 1fr;
    width: 100%;

    .fullwidth {
      grid-column: 1;
    }
  }
`;

export const StageOption = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  .color-dot {
    height: 1em;
    width: 1em;
    border-radius: 50%;
  }

  .name {
    padding-top: 2px;
  }
`;
