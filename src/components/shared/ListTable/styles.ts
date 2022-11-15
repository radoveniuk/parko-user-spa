import styled, { css } from 'styled-components';

import { themeConfig } from 'theme';

export const ListTableWrapper = styled.div<{ cols: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 1fr);
  overflow: auto;
`;

export const ListTableRow = styled.div`
  display: contents;
  grid-gap: 20px;
  &:hover {
    .list-table-cell {
      background-color: #e9e9e9;
    }
  }
`;

export const ListTableHeaderRow = styled.div<{ sticky?: boolean }>`
  display: contents;
  font-weight: 700;
  white-space: nowrap;

  ${props => props.sticky && css`
    .list-table-cell {
      position: sticky;
      top: 0;
      z-index: 2;
    }
  `}
`;

export const ListTableCell = styled.div.attrs({ className: 'list-table-cell' })`
  min-height: 30px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e9e9e9;
  padding: 10px;
  transition: background-color 0.3s;
  background-color: #fff;

  p {
    margin: 0;
  }

  .table-link {
    color: ${themeConfig.palette.primary.light};
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;
