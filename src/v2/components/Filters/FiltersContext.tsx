import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { omit } from 'lodash-es';

import useDebounce from 'hooks/useDebounce';
import useLocalStorageState from 'hooks/useLocalStorageState';
import { AnyObject } from 'interfaces/base.types';

type Props = {
  children: ReactNode;
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

const FiltersProvider = ({ children }: Props) => {
  const location = useLocation();
  const [filtersConfigString, setFiltersConfigString] = useLocalStorageState('FiltersConfig', '{}');
  const filtersConfig = JSON.parse(filtersConfigString) as AnyObject;

  const [filtersState, setFiltersState] = useState<AnyObject | undefined>(filtersConfig[location.pathname] || undefined);
  const [openDrawerFilter, setOpenDrawerFilter] = useState(true);
  const debouncedFiltersState = useDebounce(filtersState);

  const addFilter = useCallback((key: string, value: string) => {
    setFiltersState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFiltersState(prevState => omit(prevState, [key]));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  const initFilters = useCallback(() => {
    setFiltersState(filtersConfig[location.pathname] || {});
  }, [filtersConfig, location.pathname]);

  useEffect(() => {
    setFiltersConfigString(JSON.stringify({ ...filtersConfig, [location.pathname]: filtersState }));
  }, [location.pathname, filtersState, filtersConfig, setFiltersConfigString]);

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
