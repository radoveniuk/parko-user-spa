import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetDaysoff } from 'api/query/dayoffQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { SearchIcon } from 'components/icons';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';
import { ClearFiltersButton, FilterDate } from 'components/shared/Filters/Filters';
import { USER_STATUSES } from 'constants/statuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

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
  const { data: projects = [] } = useGetProjects();
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');

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
            label={t('dayoff.user')}
          />
          <FilterAutocomplete
            multiple
            filterKey="projects"
            label={t('user.project')}
            options={projects}
            getOptionLabel={(option) => `${option.client?.name ? `${option.client?.name} > ` : ''}${option.name}`}
            theme="gray"
          />
          <FilterAutocomplete
            multiple
            filterKey="userStatuses"
            label={t('user.status')}
            options={translatedStatuses}
            labelKey="label"
          />
          <FilterDate filterKey="firstDate" label={t('firstDate')} />
          <FilterDate filterKey="lastDate" label={t('lastDate')} />
          <ClearFiltersButton />
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
