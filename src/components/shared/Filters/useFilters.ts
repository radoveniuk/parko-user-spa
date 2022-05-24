import { useContext } from 'react';
import { FiltersContext } from './FiltersContext';

const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('filters context not available');
  }
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

  return [filtersState[filterKey], update];
};

export default useFilters;
