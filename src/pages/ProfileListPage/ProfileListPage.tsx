import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList } from 'api/query/userQuery';
import { ExportIcon, PlusIcon, UploadIcon } from 'components/icons';
import Button from 'components/shared/Button';
import { ClearFiLtersButton, FiltersBar, FilterSelect, FiltersProvider, FilterText, useFilters } from 'components/shared/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Page, { PageActions, PageTitle } from 'components/shared/Page';
import Pagination from 'components/shared/Pagination';
import Select from 'components/shared/Select';
import { STATUSES, STATUSES_COLORS } from 'constants/userStatuses';
import useDebounce from 'hooks/useDebounce';
import usePaginatedList from 'hooks/usePaginatedList';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IUser } from 'interfaces/users.interface';

const ROWS_PER_PAGE_OPTIONS = [20, 50, 100, 200, 500, 1000];

const COLUMNS = [
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
  const { data = [], refetch } = useGetUserList(debouncedFiltersState);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const { pageItems, paginationConfig } = usePaginatedList(data, { rowsPerPage });
  const { data: projects = [] } = useGetProjects();
  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <Page title={t('profileList')}>
      <PageTitle>{t('profileList')}</PageTitle>
      <PageActions>
        <Link to="/profile-editor">
          <Button><PlusIcon size={20}/>{t('user.create')}</Button>
        </Link>
        <Link to="/import-profiles">
          <Button><UploadIcon size={20}/>{t('user.import')}</Button>
        </Link>
        <Link to="/export-profiles">
          <Button color="secondary" variant="outlined"><ExportIcon size={20}/>{t('user.export')}</Button>
        </Link>
      </PageActions>
      <FiltersBar style={{ marginTop: 10 }}>
        <FilterText filterKey="search" label={t('search')} />
        <FilterSelect filterKey="project" label={t('user.project')} options={projects} valuePath="_id" labelPath="name" />
        <FilterSelect filterKey="status" label={t('user.status')} options={translatedStatuses} />
        <ClearFiLtersButton />
        <div style={{ marginLeft: 'auto' }}>
          <Select
            label={t('rowsPerPage')}
            value={rowsPerPage}
            options={ROWS_PER_PAGE_OPTIONS}
            onChange={(e) => void setRowsPerPage(e.target.value as number)}
            style={{ minWidth: 200 }}
          />
        </div>
      </FiltersBar>
      <ListTable columns={COLUMNS} >
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
