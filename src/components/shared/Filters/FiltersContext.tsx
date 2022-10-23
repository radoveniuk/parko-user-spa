import React, {
  createContext, ReactNode, useState,
} from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { omit } from 'lodash-es';

import usePageQueries from 'hooks/usePageQueries';
import { AnyObject } from 'interfaces/base.types';

type Props = {
  children: ReactNode;
  disablePageQueries?: boolean;
}

type contextType = {
  filtersState: {[key: string]: string} | undefined;
  addFilter(key: string, value: string): void;
  removeFilter(key: string): void;
  clearFilters(): void;
  initFilters(): void;
};

export const FiltersContext = createContext<contextType | undefined>(undefined);
FiltersContext.displayName = 'FiltersContext';

const FiltersProvider = ({ children, disablePageQueries = false }: Props) => {
  const [filtersState, setFiltersState] = useState<AnyObject | undefined>(undefined);
  const navigate = useNavigate();
  const pageQueries = usePageQueries();

  const addFilter = (key: string, value: string) => {
    setFiltersState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    if (!disablePageQueries && pageQueries[key] !== value) {
      navigate({
        search: createSearchParams({
          ...pageQueries,
          page: '1',
          [key]: value,
        }).toString(),
      });
    }
  };

  const removeFilter = (key: string) => {
    setFiltersState((prevState) => omit(prevState, [key]));
    if (!disablePageQueries) {
      navigate({
        search: createSearchParams({
          ...omit(pageQueries, key),
          page: '1',
        }).toString(),
      });
    }
  };

  const clearFilters = () => {
    setFiltersState({});
    if (!disablePageQueries) {
      navigate({
        search: createSearchParams({ page: '1' }).toString(),
      });
    }
  };

  const initFilters = () => {
    setFiltersState({});
  };

  return (
    <FiltersContext.Provider value={{ filtersState, addFilter, removeFilter, clearFilters, initFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export default FiltersProvider;
