import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetClients } from 'api/query/clientQuery';
import { AiOutlineSearchIcon } from 'components/icons';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';
import useLocalStorageState from 'hooks/useLocalStorageState';

import HeaderTable from './components/HeaderTable';
import Table from './components/Table';
import { FilterTableWrapper, ProfileListPageWrapper } from './styles';

const DEFAULT_COLS = [
  'client.sidlo',
  'client.status',
];

const ClientListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('profileList'));

  const { debouncedFiltersState } = useFilters();

  // table content
  const { data = [], refetch, remove } = useGetClients(debouncedFiltersState, { enabled: false });

  const [storedColsSettings, setStoredColsSettings] = useLocalStorageState('clientTableCols');
  const [activeCols, setActiveCols] = useState<string[]>(storedColsSettings ? JSON.parse(storedColsSettings).cols : DEFAULT_COLS);

  useEffect(() => {
    if (debouncedFiltersState) {
      refetch();
    }
    return () => { remove(); };
  }, [debouncedFiltersState, refetch, remove]);

  useEffect(() => {
    setStoredColsSettings(JSON.stringify({ cols: activeCols }));
  }, [activeCols, setStoredColsSettings]);

  return (
    <ProfileListPageWrapper cols={activeCols.length + 1}>
      <div className="container-table">
        <HeaderTable
          data={data}
          activeCols={activeCols}
        />
        <FilterTableWrapper>
          <FilterAutocomplete
            multiple
            options={data}
            getOptionLabel={client => `${client.name}`}
            filterKey="ids"
            prefixIcon={<AiOutlineSearchIcon className="search-icon"/>}
            className="filter-name"
            limitTags={1}
            placeholder={t('search')}
          />
        </FilterTableWrapper>
        <Table
          activeCols={activeCols}
          setActiveCols={setActiveCols}
          data={data}
        />
      </div>
    </ProfileListPageWrapper>
  );
};

export default function ClientListPage () {
  return (
    <FiltersProvider>
      <ClientListPageRender />
    </FiltersProvider>
  );
};
