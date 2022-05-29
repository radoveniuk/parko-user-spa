import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Page, { PageTitle } from 'components/shared/Page';
import { ClearFiLtersButton, FiltersBar, FilterSelect, FiltersProvider, FilterText, useFilters } from 'components/shared/Filters';
import useDebounce from 'hooks/useDebounce';
import { useGetDaysoff } from 'api/query/dayoffQuery';
import { getDateFromIso } from 'helpers/datetime';

const columns = [
  'dayoff.user',
  'dayoff.dateStart',
  'dayoff.dateEnd',
  'dayoff.reason',
  'dayoff.comment',
  'dayoff.adminComment',
];

const DayoffListPageRender = () => {
  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);
  const { t } = useTranslation();
  const { data, refetch } = useGetDaysoff(debouncedFiltersState);

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <Page title={t('dayoffList')}>
      <PageTitle>{t('dayoffList')}</PageTitle>
      <FiltersBar>
        <FilterText filterKey="search" label={t('search')} />
        <FilterSelect filterKey="project" label={t('user.project')} />
        <ClearFiLtersButton />
      </FiltersBar>
      <ListTable columns={columns} >
        {data?.map((item) => (
          <ListTableRow key={item._id}>
            <ListTableCell>{typeof item.user !== 'string' && `${item.user.name} ${item.user.surname}`}</ListTableCell>
            <ListTableCell>{getDateFromIso(item.dateStart)}</ListTableCell>
            <ListTableCell>{getDateFromIso(item.dateEnd)}</ListTableCell>
            <ListTableCell>{t(`selects.dayoffReason.${item.reason}`)}</ListTableCell>
            <ListTableCell>{item.description}</ListTableCell>
            <ListTableCell>{item.adminComment}</ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
    </Page>
  );
};

export default function DayoffListPage () {
  return (
    <FiltersProvider>
      <DayoffListPageRender />
    </FiltersProvider>
  );
};
