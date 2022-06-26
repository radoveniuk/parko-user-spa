import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Page, { PageTitle } from 'components/shared/Page';
import { useGetUserList } from 'api/query/userQuery';
import { useGetProjects } from 'api/query/projectQuery';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { ClearFiLtersButton, FiltersBar, FilterSelect, FiltersProvider, FilterText, useFilters } from 'components/shared/Filters';
import { STATUSES, STATUSES_COLORS } from 'constants/userStatuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import useDebounce from 'hooks/useDebounce';
import { IUser } from 'interfaces/users.interface';
import usePaginatedList from 'hooks/usePaginatedList';
import Pagination from 'components/shared/Pagination';

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
  const { pageItems, paginationConfig } = usePaginatedList(data);
  const { data: projects = [] } = useGetProjects();
  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <Page title={t('profileList')}>
      <PageTitle>{t('profileList')}</PageTitle>
      <FiltersBar>
        <FilterText filterKey="search" label={t('search')} />
        <FilterSelect filterKey="project" label={t('user.project')} options={projects} valuePath="_id" labelPath="name" />
        <FilterSelect filterKey="status" label={t('user.status')} options={translatedStatuses} />
        <ClearFiLtersButton />
      </FiltersBar>
      <ListTable columns={columns} >
        {pageItems.map((user: IUser) => (
          <Link key={user._id} to={`/profile/${user._id}`} style={{ display: 'contents', color: '#000' }}>
            <ListTableRow>
              <ListTableCell>{user.name}</ListTableCell>
              <ListTableCell>{user.surname}</ListTableCell>
              <ListTableCell>{user.email}</ListTableCell>
              <ListTableCell>{typeof user.project === 'object' && user.project?.name}</ListTableCell>
              <ListTableCell>{user.status && (
                <p
                  style={{ color: STATUSES_COLORS[user.status] }}>
                  {t(`selects.userStatus.${user.status}`)}
                </p>
              )}</ListTableCell>
            </ListTableRow>
          </Link>
        ))}
      </ListTable>
      <Pagination {...paginationConfig} />
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
