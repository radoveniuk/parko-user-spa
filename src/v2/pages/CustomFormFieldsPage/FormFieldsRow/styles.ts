import styled, { css } from 'styled-components';

import { ListTableRow } from 'components/shared/ListTable';

export const StyledListTableRow = styled(ListTableRow)`
  .menu-btn {
    opacity: 0;
  }
  &:hover {
    .menu-btn {
      opacity: 1;
    }
  }
`;
