import Chip from '@mui/material/Chip';
import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const StyledChip = styled(Chip)`
  text-transform: uppercase;
  height: 36px !important;
  border-radius: 5px !important;
  background: #E7E7E7 !important;
  @media (max-width: ${SM}) {
    height: 48px !important;
  }
`;
