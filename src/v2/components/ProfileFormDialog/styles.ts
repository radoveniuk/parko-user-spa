import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 24px;
  row-gap: 12px;
  margin-bottom: 25px;

  @media (max-width: ${SM}) {
    grid-template-columns: 1fr;
  }
`;

export const CountrySelectOption = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
