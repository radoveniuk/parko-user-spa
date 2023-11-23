import TableMUI from '@mui/material/Table';
import TableBodyMUI from '@mui/material/TableBody';
import TableCellMUI from '@mui/material/TableCell';
import TableHeadMUI from '@mui/material/TableHead';
import TableRowMUI from '@mui/material/TableRow';
import styled from 'styled-components';

export const Table = TableMUI;
export const TableBody = TableBodyMUI;
export const TableHead = styled(TableHeadMUI)`
  .MuiTableCell-root {
    border-bottom: 1px solid #D0D0D0 !important;
  }
`;
export const TableRow = styled(TableRowMUI)`
  &:not(.MuiTableRow-head) {
    &:last-child td, &:last-child th {
      border-bottom: 0 !important;
    }
  }
`;
export const TableCell = styled(TableCellMUI)`
  padding: 0 5px !important;
  font-size: 14px !important;
  border-bottom: 1px solid #E7E7E7 !important;

  &.MuiTableCell-head {
    font-weight: 600;
  }
`;
