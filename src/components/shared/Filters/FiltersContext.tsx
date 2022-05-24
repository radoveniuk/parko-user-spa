import React, {
  createContext, ReactNode, useState,
} from 'react';
import { omit } from 'lodash-es';
import { AnyObject } from 'interfaces/base.types';

type contextType = {
  filtersState: {[key: string]: string};
  addFilter(key: string, value: string): void;
  removeFilter(key: string): void;
  clearFilters(): void;
};

export const FiltersContext = createContext<contextType | undefined>(undefined);
FiltersContext.displayName = 'FiltersContext';

const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filtersState, setFiltersState] = useState<AnyObject>({});

  const addFilter = (key: string, value: string) => {
    setFiltersState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const removeFilter = (key: string) => {
    setFiltersState((prevState) => omit(prevState, [key]));
  };

  const clearFilters = () => {
    setFiltersState({});
  };

  return (
    <FiltersContext.Provider value={{ filtersState, addFilter, removeFilter, clearFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export default FiltersProvider;
