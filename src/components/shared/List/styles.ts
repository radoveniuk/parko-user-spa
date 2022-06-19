import { ListItem } from '@mui/material';
import styled from 'styled-components';

export const StyledListItem = styled(ListItem)`
  &.highlited {
    .MuiListItemText-primary {
      font-weight: 600;
    }
  }
`;
