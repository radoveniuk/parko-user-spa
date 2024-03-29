import { useContext, useEffect } from 'react';
import { isEmpty, omit } from 'lodash-es';

import usePageQueries from 'hooks/usePageQueries';

import { FiltersContext } from './FiltersContext';

const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('filters context not available');
  }
  const pageQueries = usePageQueries();
  useEffect(() => {
    if (isEmpty(omit(pageQueries, 'page'))) {
      context.initFilters();
    } else {
      context.setFiltersState(omit(pageQueries, 'page'));
    }
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
  const pageQueries = usePageQueries();

  const update = (value: string) => {
    value ? addFilter(filterKey, value) : removeFilter(filterKey);
  };

  useEffect(() => {
    const queryValue = pageQueries[filterKey];
    if (queryValue && queryValue !== filtersState?.[filterKey]) {
      addFilter(filterKey, queryValue);
    }
  }, [addFilter, filterKey, filtersState, pageQueries]);

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
