import React, { Dispatch, memo, SetStateAction, useCallback } from 'react';
import { TablePagination, TablePaginationProps } from '@mui/material';

import { PaginationWrapper } from './styles';

type PaginationProps = {
  page: number;
  count: number;
  onChange: (_e: any, value: number) => void;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
};
const Pagination = ({
  page,
  count,
  onChange,
  setRowsPerPage,
  rowsPerPage,
  ...rest
}: Omit<TablePaginationProps, 'onChange' | 'onPageChange'> & PaginationProps) => {
  const [pageCount, setPage] = React.useState(page);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    onChange(event, newPage + 1);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [setRowsPerPage],
  );

  return (
    <PaginationWrapper >
      <TablePagination
        {...rest}
        component="div"
        rowsPerPageOptions={[20, 50, 100]}
        count={count * rowsPerPage}
        page={pageCount}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </PaginationWrapper>
  );
};

export default memo(Pagination);
