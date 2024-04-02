import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetClients } from 'api/query/clientQuery';
import { useGetOrders } from 'api/query/orderQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { SearchIcon } from 'components/icons';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';
import { ClearFiltersButton } from 'components/shared/Filters/Filters';
import { CLIENT_STATUS, ORDER_COOPERATION_TYPE } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IClient } from 'interfaces/client.interface';

import MobileOrderCard from '../../components/MobileOrderCard';

import HeaderTable from './components/HeaderTable';
import Table from './components/Table';
import { FilterTableWrapper, ProfileListPageWrapper } from './styles';

const DEFAULT_COLS = [
  'order.name',
  'order.client',
  'order.project',
  'order.cooperationType',
  'order.status',
  'order.tableStats',
  'order.candidateTableStats',
  'order.dateFrom',
  'order.dateTo',
  'order.createdAt',
  'order.createdBy',
];

const OrderListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('navbar.orders'));

  // filters
  const { data: filterList = [] } = useGetOrders();
  const { debouncedFiltersState } = useFilters();
  const statusList = useTranslatedSelect(CLIENT_STATUS, 'clientStatus');
  const cooperationTypeList = useTranslatedSelect(ORDER_COOPERATION_TYPE, 'orderCooperationType');

  // table content
  const { data = [], remove, refetch, isFetching, isLoading } = useGetOrders(debouncedFiltersState, { enabled: false });
  const { data: clients = [] } = useGetClients();
  const { data: projects = [] } = useGetProjects({ clients: debouncedFiltersState?.clients });

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  useEffect(() => () => { remove(); }, [remove]);

  return (
    <ProfileListPageWrapper>
      <div className="container-table">
        <HeaderTable
          count={data.length}
        />
        <FilterTableWrapper>
          <FilterAutocomplete
            multiple
            options={filterList}
            getOptionLabel={(item) => item.name}
            filterKey="ids"
            valueKey="_id"
            prefixIcon={<SearchIcon className="search-icon"/>}
            className="filter-name"
            limitTags={1}
            label={t('search')}
          />
          <FilterAutocomplete
            multiple
            filterKey="statuses"
            label={t('order.status')}
            options={statusList}
            getOptionLabel={(option) => option.label}
            theme="gray"
          />
          <FilterAutocomplete
            multiple
            filterKey="clients"
            label={t('order.client')}
            options={clients}
            getOptionLabel={(option: IClient) => option.shortName || option.name}
            theme="gray"
          />
          <FilterAutocomplete
            disabled={!debouncedFiltersState?.clients}
            multiple
            filterKey="projects"
            label={t('order.project')}
            options={projects}
            getOptionLabel={(option) => `${option.client?.shortName ? `${option.client?.shortName} > ` : `${option.client?.name} > `}${option.name}`}
            theme="gray"
          />
          <FilterAutocomplete
            multiple
            filterKey="cooperationTypes"
            label={t('order.cooperationType')}
            options={cooperationTypeList}
            getOptionLabel={(option) => option.label}
            theme="gray"
          />
          <ClearFiltersButton />
        </FilterTableWrapper>
        <div className="mobile-list">
          {data.map((order) => (
            <MobileOrderCard
              key={order._id}
              order={order}
            />
          ))}
        </div>
        <Table
          activeCols={DEFAULT_COLS}
          data={data}
          isFetching={isLoading || isFetching}
        />
      </div>
    </ProfileListPageWrapper>
  );
};

export default function OrderListPage () {
  return (
    <FiltersProvider>
      <OrderListPageRender />
    </FiltersProvider>
  );
};
