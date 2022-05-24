import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Page, { PageTitle } from 'components/shared/Page';
import { useGetUserList } from 'api/query/userQuery';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { ClearFiLtersButton, FiltersBar, FilterSelect, FiltersProvider, FilterText, useFilters } from 'components/shared/Filters';
import { STATUSES, STATUSES_COLORS } from 'constants/userStatuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import useDebounce from 'hooks/useDebounce';

const columns = [
  'user.name',
  'user.surname',
  'user.email',
  'user.project',
  'user.status',
];

const ProfileListPageRender = () => {
  const { t } = useTranslation();
  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);
  const { data, refetch } = useGetUserList(debouncedFiltersState);
  const translatedStatuses = useTranslatedSelect(STATUSES);

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <Page title={t('profileList.title')}>
      <PageTitle>{t('profileList.title')}</PageTitle>
      <FiltersBar>
        <FilterText filterKey="search" label={t('search')} />
        <FilterSelect filterKey="project" label={t('user.project')} />
        <FilterSelect filterKey="status" label={t('user.status')} options={translatedStatuses} />
        <ClearFiLtersButton />
      </FiltersBar>
      <ListTable columns={columns} >
        {data?.map((user) => (
          <Link key={user._id} to={`/profile/${user._id}`} style={{ display: 'contents', color: '#000' }}>
            <ListTableRow>
              <ListTableCell>{user.name}</ListTableCell>
              <ListTableCell>{user.surname}</ListTableCell>
              <ListTableCell>{user.email}</ListTableCell>
              <ListTableCell>{user.project}</ListTableCell>
              <ListTableCell>{user.status ? <p style={{ color: STATUSES_COLORS[user.status] }}>{t(`selects.${user.status}`)}</p> : ''}</ListTableCell>
            </ListTableRow>
          </Link>
        ))}
      </ListTable>
    </Page>
  );
};

export default function ProfileListPage () {
  return (
    <FiltersProvider>
      <ProfileListPageRender />
    </FiltersProvider>
  );
};
