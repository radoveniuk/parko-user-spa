import React, { useEffect } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import { ApprovedIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useGetPrepayments } from 'api/query/prepaymentQuery';
import Page, { PageTitle } from 'components/shared/Page';
import { ClearFiLtersButton, FiltersBar, FilterSelect, FiltersProvider, FilterText, useFilters } from 'components/shared/Filters';
import useDebounce from 'hooks/useDebounce';

const columns = [
  'prepayment.user',
  'prepayment.date',
  'prepayment.sum',
  'prepayment.comment',
  'prepayment.approved',
];

const PrepaymentsListPageRender = () => {
  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);
  const { t } = useTranslation();
  const { data, refetch } = useGetPrepayments(debouncedFiltersState);

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <Page title={t('prepaymentsList')}>
      <PageTitle>{t('prepaymentsList')}</PageTitle>
      <FiltersBar>
        <FilterText filterKey="search" label={t('search')} />
        <FilterSelect filterKey="project" label={t('user.project')} />
        <ClearFiLtersButton />
      </FiltersBar>
      <ListTable columns={columns} >
        {data?.map((item) => (
          <ListTableRow key={item._id}>
            <ListTableCell>{typeof item.user !== 'string' && `${item.user.name} ${item.user.surname}`}</ListTableCell>
            <ListTableCell>{item.createdAt && DateTime.fromISO(item.createdAt).toFormat('dd.MM.yyyy')}</ListTableCell>
            <ListTableCell>{`${item.sum}€`}</ListTableCell>
            <ListTableCell>{item.userComment}</ListTableCell>
            <ListTableCell><ApprovedIcon approved={item.isApproved} size={20} /></ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
    </Page>
  );
};

export default function PrepaymentsListPage () {
  return (
    <FiltersProvider>
      <PrepaymentsListPageRender />
    </FiltersProvider>
  );
};
