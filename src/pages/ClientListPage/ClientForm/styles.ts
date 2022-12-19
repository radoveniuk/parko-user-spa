import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const ClientFormWrapper = styled.div`
  display: grid;
  grid-template-columns: 200px 200px 200px;
  gap: 20px;
  padding: 20px;

  @media (max-width: ${SM}) {
    grid-template-columns: 1fr;
  }
`;
