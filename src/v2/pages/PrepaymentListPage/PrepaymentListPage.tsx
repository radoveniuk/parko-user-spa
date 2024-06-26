import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterAutocomplete, FilterSelect, FiltersProvider, useFilters } from 'v2/components/Filters';
import { ClearFiltersButton, FilterDate } from 'v2/components/Filters/Filters';
import { TableSelectedItemsProvider } from 'v2/contexts/TableSelectedItemsContext';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { SearchIcon } from 'components/icons';
import { PREPAYMENT_STATUS } from 'constants/selectsOptions';
import { USER_STATUSES } from 'constants/statuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

import HeaderTable from './components/HeaderTable';
import MobilePrepaymentCard from './components/MobilePrepaymentCard';
import Table from './components/Table';
import { FilterTableWrapper, ProfileListPageWrapper } from './styles';

const DEFAULT_COLS = [
  'prepayment.user',
  'prepayment.client',
  'prepayment.project',
  'prepayment.userStatus',
  'prepayment.period',
  'prepayment.sum',
  'prepayment.comment',
  'prepayment.status',
  'prepayment.paymentDate',
  'prepayment.createdAt',
  'prepayment.createdBy',
  'prepayment.updatedBy',
];

const PrepaymentListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('navbar.prepayments'));

  const { debouncedFiltersState } = useFilters();

  // table content
  const { data = [], remove, refetch, isFetching, isLoading } = useGetPrepayments(debouncedFiltersState, { enabled: false });
  const { data: users = [] } = useGetUserListForFilter();
  const { data: projects = [] } = useGetProjects();
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');
  const translatedPrepaymentStatuses = useTranslatedSelect(PREPAYMENT_STATUS, 'prepaymentStatus', true, false);

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  useEffect(() => () => { remove(); }, [remove]);

  return (
    <ProfileListPageWrapper cols={DEFAULT_COLS.length + 1}>
      <div className="container-table">
        <HeaderTable
          data={data}
          activeCols={DEFAULT_COLS}
        />
        <FilterTableWrapper>
          <FilterAutocomplete
            multiple
            options={users}
            labelKey="fullname"
            filterKey="users"
            valueKey="_id"
            prefixIcon={<SearchIcon className="search-icon"/>}
            className="filter-name"
            limitTags={1}
            label={t('prepayment.user')}
          />
          <FilterAutocomplete
            multiple
            filterKey="projects"
            label={t('user.project')}
            options={projects}
            labelKey="name"
          />
          <FilterAutocomplete
            multiple
            filterKey="userStatuses"
            label={t('user.status')}
            options={translatedStatuses}
            labelKey="label"
          />
          <FilterSelect
            filterKey="status"
            label={t('prepayment.status')}
            options={translatedPrepaymentStatuses}
            emptyItem="noSelected"
          />
          <FilterDate filterKey="firstDate" label={t('firstDate')} />
          <FilterDate filterKey="lastDate" label={t('lastDate')} />
          <ClearFiltersButton />
        </FilterTableWrapper>
        <div className="mobile-list">
          {data.map((prepayment) => (
            <MobilePrepaymentCard
              key={prepayment._id}
              prepayment={prepayment}
            />
          ))}
        </div>
        <Table
          activeCols={['', ...DEFAULT_COLS, '']}
          data={data}
          isFetching={isLoading || isFetching}
        />
      </div>
    </ProfileListPageWrapper>
  );
};

export default function PrepaymentListPage () {
  return (
    <FiltersProvider>
      <TableSelectedItemsProvider>
        <PrepaymentListPageRender />
      </TableSelectedItemsProvider>
    </FiltersProvider>
  );
};
