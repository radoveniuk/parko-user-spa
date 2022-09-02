import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { usePapaParse } from 'react-papaparse';
import { DateTime } from 'luxon';
import { pick } from 'lodash-es';

import Page, { PageActions, PageTitle } from 'components/shared/Page';
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
import Button from 'components/shared/Button';
import { ExportIcon, PlusIcon, UploadIcon } from 'components/icons';
import Select from 'components/shared/Select';
import { IMPORTABLE_USER_FIELDS } from 'constants/userCsv';

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
  const { jsonToCSV } = usePapaParse();

  const exportData = () => {
    const dataToExport = data.map((item) => {
      const pickedItem = pick(item, IMPORTABLE_USER_FIELDS) as Record<keyof IUser, string | boolean>;
      const exportItem: Record<string, string | boolean> = {};
      IMPORTABLE_USER_FIELDS.forEach((key) => {
        exportItem[t(`user.${key}`)] = pickedItem[key] || '';
      });
      return exportItem;
    });

    const csvContent = `data:text/csv;charset=utf-8,${jsonToCSV(dataToExport)}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `parko_users_export_${DateTime.now().toFormat('dd.MM.yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <Page title={t('profileList')}>
      <PageTitle>{t('profileList')}</PageTitle>
      <PageActions>
        <Button color="secondary" variant="outlined" onClick={exportData}><ExportIcon size={20}/>{t('user.export')}</Button>
        <Link to="/upload-profiles">
          <Button color="secondary"><UploadIcon size={20}/>{t('user.import')}</Button>
        </Link>
        <Link to="/profile-editor">
          <Button color="secondary"><PlusIcon size={20}/>{t('user.create')}</Button>
        </Link>
      </PageActions>
      <FiltersBar>
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
