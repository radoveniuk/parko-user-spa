import styled, { css } from 'styled-components';

import { ListTableRow } from 'components/shared/ListTable';

export const StyledListTableRow = styled(ListTableRow)<{ isActive: boolean }>`
  .menu-btn {
    opacity: 0;
  }
  &:hover {
    .menu-btn {
      opacity: 1;
    }
  }

  ${(props) => props.isActive && css`
    .list-table-cell {
      background-color: #e9e9e9;
    }
    .menu-btn {
      opacity: 1;
    }
  `}
`;
