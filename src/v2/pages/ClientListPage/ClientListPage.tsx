import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetClients } from 'api/query/clientQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { SearchIcon } from 'components/icons';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';
import useLocalStorageState from 'hooks/useLocalStorageState';
import { IClient } from 'interfaces/client.interface';

import HeaderTable from './components/HeaderTable';
import MobileClientCard from './components/MobileClientCard';
import Table from './components/Table';
import { FilterTableWrapper, ProfileListPageWrapper } from './styles';

const DEFAULT_COLS = [
  'client.sidlo',
  'client.status',
];

const ClientListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('navbar.clients'));
  const { data: projects } = useGetProjects();

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
            prefixIcon={<SearchIcon className="search-icon"/>}
            className="filter-name"
            limitTags={1}
            placeholder={t('search')}
          />
        </FilterTableWrapper>
        <div className="mobile-list">
          {data.map((client) => (
            <MobileClientCard
              key={client._id}
              client={client}
              projectsCount={projects?.filter(project => (project.client as IClient)?._id === client._id)?.length || 0}
            />
          ))}
        </div>
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
