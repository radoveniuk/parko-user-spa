import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import useLocalStorageState from './useLocalStorageState';
import usePageQueries from './usePageQueries';
import usePrev from './usePrev';

type Options = {
  rowsPerPage?: number;
  defaultPage?: number;
};

const usePaginatedList = <T>(list: T[] = [], options?: Options) => {
  const location = useLocation();
  const [rowsPerPageConfigString, setRowsPerPageConfigString] = useLocalStorageState('RowsPerPageConfig', '{}');
  const rowsPerPageConfig = JSON.parse(rowsPerPageConfigString) as Record<string, number>;

  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageConfig[location.pathname] || options?.rowsPerPage || 20);

  const defaultPage = options?.defaultPage || 0;
  const [page, setPage] = useState(defaultPage);
  const navigate = useNavigate();
  const pageQueries = usePageQueries();

  const pageItems = useMemo(() => list.slice(rowsPerPage * page, rowsPerPage * (page + 1)), [list, page, rowsPerPage]);
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

  useEffect(() => {
    setRowsPerPageConfigString(JSON.stringify({ ...rowsPerPageConfig, [location.pathname]: rowsPerPage }));
  }, [location.pathname, rowsPerPage, rowsPerPageConfig, setRowsPerPageConfigString]);

  return {
    pageItems,
    paginationConfig: {
      page,
      onChange,
      count: pagesCount,
      rowsPerPage,
      setRowsPerPage,
    },
  };
};

export default usePaginatedList;
