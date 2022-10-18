import React from 'react';
import Paper from '@mui/material/Paper';
import TableMaterial from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { Column, Row } from 'interfaces/table.types';

import { TableWrapper } from './styles';
import TableHead from './TableHead';

type TableProps = {
  rowsPerPage?: number;
  columns: Column[]
  rows?: Row[];
}

export default function Table ({ rowsPerPage = 5, rows, columns }: TableProps) {
  const [page, setPage] = React.useState(0);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (rows?.length || 0)) : 0;

  return (
    <TableWrapper>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <TableMaterial
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHead columns={columns} />
            <TableBody>
              {!!rows && rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={index}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={`${col.headerName}-${index}`}
                        align="center"
                      >
                        {col.valueGetter !== undefined ? col.valueGetter(row[col.field]) : row[col.field]}
                      </TableCell>

                    ))}
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 50 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} align="center" />
                </TableRow>
              )}
            </TableBody>
          </TableMaterial>
        </TableContainer>
        <TablePagination
          component="div"
          count={rows?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          labelRowsPerPage={false}
          rowsPerPageOptions={[]}
        />
      </Paper>
    </TableWrapper>
  );
}
