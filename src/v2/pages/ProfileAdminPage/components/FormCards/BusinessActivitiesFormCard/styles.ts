import styled from 'styled-components';
import { TableCell } from 'v2/uikit/Table';

import { TB } from 'theme/sizeBreakpoints';

export const ActionsCell = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-end;
`;

export const ActivityDialogContent = styled.div`
  .form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    row-gap: 12px;
    margin-bottom: 48px;
  
    *:first-child {
      grid-column: 1 / 3;
    }

    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
      *:first-child {
        grid-column: 1;
      }
    }
  }
`;

export const DescriptionTableCell = styled(TableCell)`
  max-width: 240px;
  white-space: wrap;
`;

export const ExpandTableWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  button {
    width: 100%;
  }
`;
