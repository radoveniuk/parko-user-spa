import { useEffect, useMemo, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import usePageQueries from './usePageQueries';

type Options = {
  rowsPerPage?: number;
  defaultPage?: number;
};

const usePaginatedList = <T>(list: T[] = [], options?: Options) => {
  const rowsPerPage = options?.rowsPerPage || 10;
  const defaultPage = options?.defaultPage || 1;
  const [page, setPage] = useState(defaultPage);
  const navigate = useNavigate();
  const pageQueries = usePageQueries();

  const pageItems = useMemo(() => list.slice(rowsPerPage * (page - 1), rowsPerPage * page), [list, page, rowsPerPage]);
  const pagesCount = useMemo(() => Math.ceil(list.length / rowsPerPage), [list, rowsPerPage]);

  useEffect(() => {
    setPage(defaultPage);
  }, [defaultPage, list.length]);

  useEffect(() => {
    if (pageQueries.page && pageQueries.page !== page.toString()) {
      setPage(Number(pageQueries.page));
    }
  }, [page, pageQueries]);

  return {
    pageItems,
    paginationConfig: {
      page,
      onChange: (_e: any, value: number) => {
        setPage(value);
        navigate({
          search: createSearchParams({
            ...pageQueries,
            page: `${value}`,
          }).toString(),
        });
      },
      count: pagesCount,
    },
  };
};

export default usePaginatedList;
