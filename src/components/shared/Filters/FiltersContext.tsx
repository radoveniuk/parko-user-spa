import React, {
  createContext, ReactNode, useState,
} from 'react';
import { omit } from 'lodash-es';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { AnyObject } from 'interfaces/base.types';
import usePageQueries from 'hooks/usePageQueries';

type Props = {
  children: ReactNode;
  disablePageQueries?: boolean;
}

type contextType = {
  filtersState: {[key: string]: string};
  addFilter(key: string, value: string): void;
  removeFilter(key: string): void;
  clearFilters(): void;
};

export const FiltersContext = createContext<contextType | undefined>(undefined);
FiltersContext.displayName = 'FiltersContext';

const FiltersProvider = ({ children, disablePageQueries = false }: Props) => {
  const [filtersState, setFiltersState] = useState<AnyObject>({});
  const navigate = useNavigate();
  const pageQueries = usePageQueries();

  const addFilter = (key: string, value: string) => {
    setFiltersState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    if (!disablePageQueries) {
      if (pageQueries[key] !== value) {
        navigate({
          search: createSearchParams({
            ...pageQueries,
            page: '1',
            [key]: value,
          }).toString(),
        });
      }
    } else {
      navigate({
        search: createSearchParams({
          ...omit(pageQueries, key),
          page: '1',
        }).toString(),
      });
    }
  };

  const removeFilter = (key: string) => {
    setFiltersState((prevState) => omit(prevState, [key]));
    navigate({
      search: createSearchParams({
        ...omit(pageQueries, key),
        page: '1',
      }).toString(),
    });
  };

  const clearFilters = () => {
    setFiltersState({});
    navigate({
      search: createSearchParams({ page: '1' }).toString(),
    });
  };

  return (
    <FiltersContext.Provider value={{ filtersState, addFilter, removeFilter, clearFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export default FiltersProvider;
