import { useMemo, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { orderBy } from 'lodash-es';

import { Path } from 'interfaces/base.types';

import usePageQueries from './usePageQueries';

export type SortingValue<T> = Path<T> | ((v: T) => unknown);

export type Sort<T> = {
  dir: 'asc' | 'desc';
  key: string;
  sorting: SortingValue<T>;
};

export default function useSortedList <T> (data: T[]) {
  const navigate = useNavigate();
  const pageQueries = usePageQueries();
  const [sort, setSort] = useState<null | Sort<T>>(null);
  const sortedData = useMemo(() => {
    if (!sort) return data;
    return orderBy(data, sort.sorting, sort.dir);
  }, [data, sort]);

  const sortingToggler = (key: string, sorting: Path<T> | ((v: T) => unknown)) => {
    if (pageQueries?.page) {
      navigate({
        search: createSearchParams({
          ...pageQueries,
          page: '1',
        }).toString(),
      });
    }
    setSort((prev) => {
      if (prev?.key === key && prev?.dir === 'asc') return { ...prev, dir: 'desc' };
      if (prev?.key === key && prev?.dir === 'desc') return null;

      return { dir: 'asc', sorting, key };
    });
  };

  return {
    sorting: sort,
    setSorting: setSort,
    sortedData,
    sortingToggler,
  };
}
