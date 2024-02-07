import styled from 'styled-components';
import { Input } from 'v2/uikit';

import { TB } from 'theme/sizeBreakpoints';

export const InputIBAN = styled(Input)`
  grid-column: 1 / 3;
  @media (max-width: ${TB}) {
    grid-column: 1 / 1;
  }
` as unknown as typeof Input;
