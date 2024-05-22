import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 250px);
  column-gap: 24px;
  row-gap: 12px;
  margin-bottom: 25px;

  .fullwidth {
    grid-column: 1 / 3;
  }

  @media (max-width: ${SM}) {
    grid-template-columns: 1fr;

    .fullwidth {
      grid-column: 1;
    }
  }
`;

export const CountrySelectOption = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const NamesakesDialogContent = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr;

  @media (max-width: ${SM}) {
    svg {
      display: none;
    }
    grid-template-columns: 1fr;
  }
`;
