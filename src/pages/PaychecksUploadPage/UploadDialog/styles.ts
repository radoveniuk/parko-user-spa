import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const UploadPaycheckFormWrapper = styled.div`
  display: grid;
  grid-template-columns: 300px;
  grid-gap: 10px;
  padding: 15px;
  
  @media (min-width: ${SM}) {
    grid-template-columns: 300px 300px;
  }
`;
