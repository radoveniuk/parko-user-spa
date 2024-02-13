import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { SearchIcon } from 'components/icons';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';

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
  'prepayment.date',
  'prepayment.paymentDate',
  '',
];

const PrepaymentListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('navbar.prepayments'));

  const { debouncedFiltersState } = useFilters();

  // table content
  const { data = [], remove, refetch, isFetching, isLoading } = useGetPrepayments(debouncedFiltersState, { enabled: false });
  const { data: users = [] } = useGetUserListForFilter();

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
            placeholder={t('search')}
          />
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
