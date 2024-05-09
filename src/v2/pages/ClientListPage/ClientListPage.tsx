import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cloneDeep from 'lodash-es/cloneDeep';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'v2/components/Filters';
import { FilterSwitch } from 'v2/components/Filters/Filters';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetClients } from 'api/query/clientQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { SearchIcon } from 'components/icons';
import { CLIENT_STATUS } from 'constants/selectsOptions';
import { useAuthData } from 'contexts/AuthContext';
import useLocalStorageState from 'hooks/useLocalStorageState';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IClient } from 'interfaces/client.interface';
import { IUser } from 'interfaces/users.interface';

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
  const { id: userId, permissions } = useAuthData();
  const statuses = useTranslatedSelect(CLIENT_STATUS, 'clientStatus', true, false);
  useDocumentTitle(t('navbar.clients'));
  const { data: projects } = useGetProjects();

  const { filtersState } = useFilters();

  // table content
  const { data = [], isFetching } = useGetClients();

  const clients = useMemo(() => {
    let filteredData = cloneDeep(data);
    if (filtersState?.isInternal && permissions.includes('internal:read')) {
      filteredData = filteredData.filter(client => client.isInternal === (filtersState.isInternal === 'true'));
    }
    if (filtersState?.ids) {
      filteredData = filteredData.filter(client => filtersState.ids.includes(client._id));
    }
    if (filtersState?.statuses) {
      filteredData = filteredData.filter(client => filtersState.statuses.split(',').includes(client.status));
    }
    if (filtersState?.my === 'true') {
      filteredData = filteredData.filter(client => client.managers?.some((m) => (m as IUser)._id === userId));
    }
    return filteredData;
  }, [data, filtersState, userId, permissions]);

  // useEffect(() => remove, [remove]);

  const [storedColsSettings, setStoredColsSettings] = useLocalStorageState('clientsTableCols');
  const [activeCols, setActiveCols] = useState<string[]>(storedColsSettings ? JSON.parse(storedColsSettings).cols : DEFAULT_COLS);

  useEffect(() => {
    setStoredColsSettings(JSON.stringify({ cols: activeCols }));
  }, [activeCols, setStoredColsSettings]);

  return (
    <ProfileListPageWrapper cols={activeCols.length + 1}>
      <div className="container-table">
        <HeaderTable data={clients} />
        <FilterTableWrapper>
          <FilterAutocomplete
            multiple
            options={data}
            getOptionLabel={(client) => `${client.shortName}`}
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
          {clients.map((client) => (
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
          data={clients}
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
