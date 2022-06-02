import styled from 'styled-components';

export const ListTableWrapper = styled.div<{ cols: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 1fr);
  overflow: auto;
`;

export const ListTableRow = styled.div`
  display: contents;
  cursor: pointer;
  grid-gap: 20px;
  &:hover {
    .list-table-cell {
      background-color: #e9e9e9;
    }
  }
`;

export const ListTableHeaderRow = styled.div`
  display: contents;
  font-weight: 700;
`;

export const ListTableCell = styled.div.attrs({ className: 'list-table-cell' })`
  min-height: 30px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e9e9e9;
  padding: 10px;
  transition: background-color 0.3s;
`;
