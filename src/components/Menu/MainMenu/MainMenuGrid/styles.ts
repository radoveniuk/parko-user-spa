import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const Wrapper = styled.div`
  display: flex;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: ${SM}) {
    flex-direction: column;
    padding: 20px;
  }
`;
