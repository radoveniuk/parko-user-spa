import { useContext, useEffect } from 'react';

import { FiltersContext } from './FiltersContext';

const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('filters context not available');
  }

  useEffect(() => {
    context.initFilters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return context;
};

export const useFilterState = (filterKey: string): [string, (value: string) => void] => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('Filters context not available');
  }
  const {
    filtersState, addFilter, removeFilter,
  } = context;

  const update = (value: string) => {
    value ? addFilter(filterKey, value) : removeFilter(filterKey);
  };

  return [filtersState?.[filterKey] || '', update];
};

export const useOpenFilterDrawler = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('Filters context not available');
  }

  const { openDrawerFilter, setOpenDrawerFilter } = context;

  return { openDrawerFilter, setOpenDrawerFilter };
};

export default useFilters;
