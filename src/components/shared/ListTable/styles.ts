import styled, { css } from 'styled-components';

import { themeConfig } from 'theme';

export const ListTableWrapper = styled.div<{ cols: number, maxHeight?: string | number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 1fr);
  overflow: auto;
  max-height: ${props => (typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight) || 'auto'};
`;

export const ListTableRow = styled.div.attrs({ className: 'list-table-row' })<{ error?: boolean }>`
  display: contents;
  grid-gap: 20px;
  ${props => !props.error && css`
    &:hover {
      .list-table-cell {
        background-color: #e9e9e9;
        .table-link {
          color: rgb(0 86 255);
        }
      }
    }
  `}

  ${props => props.error && css`
    .list-table-cell {
      background-color: #f2e5e5 !important;

      .table-link {
        color: #720000;
      }
    }
  `}
`;

export const ListTableHeaderRow = styled.div<{ sticky?: boolean }>`
  display: contents;
  font-weight: 700;
  white-space: nowrap;

  .list-table-cell {
    cursor: default;
    user-select: none; 
  }

  ${props => props.sticky && css`
    .list-table-cell {
      position: sticky;
      top: 0;
      z-index: 2;
    }
  `}
`;

export const ListTableCell = styled.div.attrs({ className: 'list-table-cell' })<{ color?: string }>`
  height: 30px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e9e9e9;
  padding: 10px;
  transition: background-color 0.3s;
  background-color: #fff;
  white-space: nowrap;
  ${(props) => props.color && css`
    color: ${props.color};
  `}

  p {
    margin: 0;
  }

  .table-link {
    color: ${themeConfig.palette.primary.main};
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .sort-btn {
    color: #f0f0f0;
    transition: transform .2s;
    &.active {
      color: ${themeConfig.palette.primary.main};
    }
    &.desc {
      transform: rotate(180deg);
    }
  }
`;
