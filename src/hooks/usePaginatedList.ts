import { useEffect, useMemo, useState } from 'react';

type Options = {
  rowsPerPage?: number;
  defaultPage?: number;
};

const usePaginatedList = <T>(list: T[] = [], options?: Options) => {
  const rowsPerPage = options?.rowsPerPage || 10;
  const defaultPage = options?.defaultPage || 1;
  const [page, setPage] = useState(defaultPage);

  const pageItems = useMemo(() => list.slice(rowsPerPage * (page - 1), rowsPerPage * page), [list, page, rowsPerPage]);
  const pagesCount = useMemo(() => Math.ceil(list.length / rowsPerPage), [list, rowsPerPage]);

  useEffect(() => {
    setPage(defaultPage);
  }, [defaultPage, list.length]);

  return {
    pageItems,
    paginationConfig: {
      page,
      onChange: (_e: any, value: number) => void setPage(value),
      count: pagesCount,
    },
  };
};

export default usePaginatedList;
