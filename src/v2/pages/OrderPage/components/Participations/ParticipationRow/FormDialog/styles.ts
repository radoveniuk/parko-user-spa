import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const FormWrapper = styled.div`
  width: 500px;

  @media (max-width: ${TB}) {
    width: 100%;
  }
`;
