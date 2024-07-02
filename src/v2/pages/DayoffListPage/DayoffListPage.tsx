import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'v2/components/Filters';
import { ClearFiltersButton, FilterDate } from 'v2/components/Filters/Filters';
import { TableSelectedItemsProvider } from 'v2/contexts/TableSelectedItemsContext';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetDaysoff } from 'api/query/dayoffQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { SearchIcon } from 'components/icons';
import { USER_STATUSES } from 'constants/statuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

import HeaderTable from './components/HeaderTable';
import MobileDayoffCard from './components/MobileDayoffCard';
import Table from './components/Table';
import { DaysoffListPageWrapper, FilterTableWrapper } from './styles';

const DEFAULT_COLS = [
  'dayoff.user',
  'dayoff.client',
  'dayoff.project',
  'dayoff.userStatus',
  'dayoff.status',
  'dayoff.dateStart',
  'dayoff.dateEnd',
  'dayoff.reason',
  'dayoff.adminComment',
  'dayoff.docs',
  'dayoff.createdAt',
  'dayoff.createdBy',
  'dayoff.updatedBy',
];

const DayoffListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('navbar.daysoff'));

  const { debouncedFiltersState } = useFilters();

  // table content
  const { data = [], remove, isFetching, isLoading } = useGetDaysoff(debouncedFiltersState);
  const { data: users = [] } = useGetUserListForFilter();
  const { data: projects = [] } = useGetProjects();
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');

  useEffect(() => () => { remove(); }, [remove]);

  return (
    <DaysoffListPageWrapper cols={DEFAULT_COLS.length + 1}>
      <div className="container-table">
        <HeaderTable data={data} activeCols={DEFAULT_COLS} />
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
          activeCols={['', ...DEFAULT_COLS, '']}
          data={data}
          isFetching={isLoading || isFetching}
        />
      </div>
    </DaysoffListPageWrapper>
  );
};

export default function DayoffListPage () {
  return (
    <FiltersProvider>
      <TableSelectedItemsProvider>
        <DayoffListPageRender />
      </TableSelectedItemsProvider>
    </FiltersProvider>
  );
};
