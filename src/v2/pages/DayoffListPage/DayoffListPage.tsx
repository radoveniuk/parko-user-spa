import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetDaysoff } from 'api/query/dayoffQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { SearchIcon } from 'components/icons';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';

import HeaderTable from './components/HeaderTable';
import MobileDayoffCard from './components/MobileDayoffCard';
import Table from './components/Table';
import { FilterTableWrapper, ProfileListPageWrapper } from './styles';

const DEFAULT_COLS = [
  'dayoff.user',
  'user.project',
  'user.status',
  'dayoff.status',
  'dayoff.dateStart',
  'dayoff.dateEnd',
  'dayoff.reason',
  'dayoff.comment',
  'dayoff.adminComment',
  'dayoff.docs',
  '',
];

const DayoffListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('navbar.daysoff'));

  const { debouncedFiltersState } = useFilters();

  // table content
  const { data = [], remove, refetch, isFetching, isLoading } = useGetDaysoff(debouncedFiltersState, { enabled: false });
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
          {data.map((dayoff) => (
            <MobileDayoffCard
              key={dayoff._id}
              data={dayoff}
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

export default function DayoffListPage () {
  return (
    <FiltersProvider>
      <DayoffListPageRender />
    </FiltersProvider>
  );
};
