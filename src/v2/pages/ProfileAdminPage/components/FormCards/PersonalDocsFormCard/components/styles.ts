import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const DocForm = styled.div`
  .title {
    color: #131313;
    font-weight: 600;
  }
  .fields {
    margin-top: 15px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 20px;
    row-gap: 15px;
    .fullwidth {
      grid-column: 1 / 3;
    }

    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
      .fullwidth {
        grid-column: 1 / 1;
      }
    }
  }
`;

export const CountrySelectOption = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
