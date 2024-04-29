import React, { createContext, ReactNode, useCallback, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { omit } from 'lodash-es';

import useDebounce from 'hooks/useDebounce';
import usePageQueries from 'hooks/usePageQueries';
import { AnyObject } from 'interfaces/base.types';

type Props = {
  children: ReactNode;
  disablePageQueries?: boolean;
};

type contextType = {
  filtersState: { [key: string]: string } | undefined;
  debouncedFiltersState?: AnyObject;
  addFilter(key: string, value: string): void;
  removeFilter(key: string): void;
  clearFilters(): void;
  initFilters(): void;
  openDrawerFilter: boolean;
  setOpenDrawerFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setFiltersState: React.Dispatch<React.SetStateAction<AnyObject | undefined>>;
};

export const FiltersContext = createContext<contextType | undefined>(undefined);
FiltersContext.displayName = 'FiltersContext';

const FiltersProvider = ({ children, disablePageQueries = false }: Props) => {
  const [filtersState, setFiltersState] = useState<AnyObject | undefined>(undefined);
  const [openDrawerFilter, setOpenDrawerFilter] = useState(true);
  const debouncedFiltersState = useDebounce(filtersState);
  const navigate = useNavigate();
  const pageQueries = usePageQueries();

  const addFilter = (key: string, value: string) => {
    setFiltersState(prevState => ({
      ...prevState,
      [key]: value,
    }));
    if (!disablePageQueries && pageQueries[key] !== value) {
      navigate({
        search: createSearchParams({
          ...pageQueries,
          page: '0',
          [key]: value,
        }).toString(),
      });
    }
  };

  const removeFilter = useCallback((key: string) => {
    setFiltersState(prevState => omit(prevState, [key]));
    if (!disablePageQueries) {
      navigate({
        search: createSearchParams({
          ...omit(pageQueries, key),
          page: '0',
        }).toString(),
      });
    }
  }, [disablePageQueries, navigate, pageQueries]);

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
    <FiltersContext.Provider
      value={{
        filtersState,
        debouncedFiltersState,
        addFilter,
        removeFilter,
        clearFilters,
        initFilters,
        openDrawerFilter,
        setOpenDrawerFilter,
        setFiltersState,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export default FiltersProvider;
