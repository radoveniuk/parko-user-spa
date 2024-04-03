import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { SearchIcon } from 'components/icons';
import { FilterAutocomplete, FilterSelect, FiltersProvider, useFilters } from 'components/shared/Filters';
import { ClearFiltersButton, FilterDate } from 'components/shared/Filters/Filters';
import { PREPAYMENT_STATUS } from 'constants/selectsOptions';
import { USER_STATUSES } from 'constants/statuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

import HeaderTable from './components/HeaderTable';
import MobilePrepaymentCard from './components/MobilePrepaymentCard';
import Table from './components/Table';
import { FilterTableWrapper, ProfileListPageWrapper } from './styles';

const DEFAULT_COLS = [
  'prepayment.user',
  'user.project',
  'user.status',
  'prepayment.period',
  'prepayment.sum',
  'prepayment.comment',
  'prepayment.status',
  'prepayment.paymentDate',
  'prepayment.createdAt',
  'prepayment.createdBy',
  'prepayment.updatedBy',
  '',
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
  const translatedPrepaymentStatuses = useTranslatedSelect(PREPAYMENT_STATUS, 'prepaymentStatus');

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  useEffect(() => () => { remove(); }, [remove]);

  return (
    <ProfileListPageWrapper>
      <div className="container-table">
        <HeaderTable
          data={data}
          activeCols={DEFAULT_COLS}
        />
        <FilterTableWrapper>
          <FilterAutocomplete
            multiple
            options={users}
            getOptionLabel={(user) => `${user.name} ${user.surname}`}
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
          activeCols={DEFAULT_COLS}
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
      <PrepaymentListPageRender />
    </FiltersProvider>
  );
};
