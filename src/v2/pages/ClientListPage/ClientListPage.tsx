import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetClients } from 'api/query/clientQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { SearchIcon } from 'components/icons';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';
import { FilterSwitch } from 'components/shared/Filters/Filters';
import { CLIENT_STATUS } from 'constants/selectsOptions';
import useLocalStorageState from 'hooks/useLocalStorageState';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
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
  const statuses = useTranslatedSelect(CLIENT_STATUS, 'clientStatus', true, false);
  useDocumentTitle(t('navbar.clients'));
  const { data: projects } = useGetProjects();

  const { debouncedFiltersState } = useFilters();

  // table content
  const { data = [], refetch, remove, isFetching } = useGetClients(debouncedFiltersState, { enabled: false });

  useEffect(() => {
    if (debouncedFiltersState) {
      refetch();
    }
    return () => { remove(); };
  }, [debouncedFiltersState, refetch, remove]);

  const [storedColsSettings, setStoredColsSettings] = useLocalStorageState('clientsTableCols');
  const [activeCols, setActiveCols] = useState<string[]>(storedColsSettings ? JSON.parse(storedColsSettings).cols : DEFAULT_COLS);

  useEffect(() => {
    setStoredColsSettings(JSON.stringify({ cols: activeCols }));
  }, [activeCols, setStoredColsSettings]);

  return (
    <ProfileListPageWrapper cols={activeCols.length + 1}>
      <div className="container-table">
        <HeaderTable data={data} />
        <FilterTableWrapper>
          <FilterAutocomplete
            multiple
            options={data}
            getOptionLabel={(client) => `${client.name}`}
            filterKey="ids"
            prefixIcon={<SearchIcon className="search-icon"/>}
            className="filter-name"
            limitTags={1}
            label={t('search')}
          />
          <FilterAutocomplete
            multiple
            options={statuses}
            getOptionLabel={(status) => `${status.label}`}
            filterKey="statuses"
            limitTags={1}
            label={t('client.status')}
          />
          <FilterSwitch
            filterKey="my"
            label={t('myFilter')}
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
          isFetching={isFetching}
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
