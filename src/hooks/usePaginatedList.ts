import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

import usePageQueries from './usePageQueries';
import usePrev from './usePrev';

type Options = {
  rowsPerPage?: number;
  defaultPage?: number;
};

const usePaginatedList = <T>(list: T[] = [], options?: Options) => {
  const rowsPerPage = options?.rowsPerPage || 10; // TODO change to useState and props setRowsPerPage
  const defaultPage = options?.defaultPage || 1;
  const [page, setPage] = useState(defaultPage);
  const navigate = useNavigate();
  const pageQueries = usePageQueries();

  const pageItems = useMemo(() => list.slice(rowsPerPage * (page - 1), rowsPerPage * page), [list, page, rowsPerPage]);
  const pagesCount = useMemo(() => Math.ceil(list.length / rowsPerPage), [list, rowsPerPage]);

  const onChange = useCallback((_e: any, value: number) => {
    setPage(value);
    navigate({
      search: createSearchParams({
        ...pageQueries,
        page: `${value}`,
      }).toString(),
    });
  }, [navigate, pageQueries]);

  const prevRowsPerPage = usePrev(rowsPerPage);
  const prevListLength = usePrev(list.length);

  useEffect(() => {
    if ((rowsPerPage !== prevRowsPerPage && prevRowsPerPage) || (list.length !== prevListLength && prevListLength)) {
      onChange(null, defaultPage);
    }
  }, [defaultPage, list.length, onChange, rowsPerPage, prevListLength, prevRowsPerPage]);

  useEffect(() => {
    if (pageQueries.page && pageQueries.page !== page.toString()) {
      setPage(Number(pageQueries.page));
    }
  }, [page, pageQueries]);

  return {
    pageItems,
    paginationConfig: {
      page,
      onChange,
      count: pagesCount,
    },
  };
};

export default usePaginatedList;
