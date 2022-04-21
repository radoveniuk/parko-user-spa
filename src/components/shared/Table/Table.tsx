import React from 'react';
import Box from '@mui/material/Box';
import TableMaterial from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export type Column = {
  field: string;
  headerName: string;
  type?: 'string' | 'number' | 'boolean';
  valueGetter?: (value: any) => string | React.ReactNode;
}

type TableHeadProps = {
  columns: Column[]
}

function EnhancedTableHead ({ columns }: TableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.field}
            align={headCell.type === 'number' ? 'right' : 'left'}
            padding="normal"
          >
            {headCell.headerName}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

type TableProps = {
  rowsPerPage?: number;
  columns: Column[]
  rows: any[];
}

export default function Table ({ rowsPerPage = 5, rows, columns }: TableProps) {
  const [page, setPage] = React.useState(0);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <TableMaterial
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead columns={columns} />
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                    >
                      {columns.map((col) => (
                        <TableCell
                          key={`${col.headerName}-${index}`}
                        >
                          {col.valueGetter !== undefined ? col.valueGetter(row[col.field]) : row[col.field]}
                        </TableCell>

                      ))}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 50 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </TableMaterial>
        </TableContainer>
        <TablePagination
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          labelRowsPerPage={false}
          rowsPerPageOptions={[]}
        />
      </Paper>
    </Box>
  );
}
