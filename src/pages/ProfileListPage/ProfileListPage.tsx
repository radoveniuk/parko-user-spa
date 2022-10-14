import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import PrintDocDialog from 'components/complex/PrintDocDialog';
import { CheckAllIcon, ExportIcon, PlusIcon, PrintIcon, RemoveCheckIcon, SelectMenuIcon, UploadIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import { ClearFiLtersButton, FilterAutocomplete, FiltersBar, FilterSelect, FiltersProvider, useFilters } from 'components/shared/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Menu, { Divider, MenuItem } from 'components/shared/Menu';
import Page, { PageActions, PageTitle } from 'components/shared/Page';
import Pagination from 'components/shared/Pagination';
import Select from 'components/shared/Select';
import { STATUSES, STATUSES_COLORS } from 'constants/userStatuses';
import useDebounce from 'hooks/useDebounce';
import usePaginatedList from 'hooks/usePaginatedList';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IUser } from 'interfaces/users.interface';

import { ProfileListPageWrapper } from './styles';

const ROWS_PER_PAGE_OPTIONS = [20, 50, 100, 200, 500, 1000];

const COLUMNS = [
  '',
  'user.name',
  'user.email',
  'user.project',
  'user.status',
];

const ProfileListPageRender = () => {
  const { t } = useTranslation();
  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);

  const { data = [], refetch, remove } = useGetUserList(debouncedFiltersState, { enabled: false });
  const { data: usersFilter = [] } = useGetUserListForFilter();
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const { pageItems, paginationConfig } = usePaginatedList(data, { rowsPerPage });
  const { data: projects = [] } = useGetProjects();
  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  useEffect(() => {
    if (debouncedFiltersState) {
      refetch();
    }
    return () => { remove(); };
  }, [debouncedFiltersState, refetch, remove]);

  return (
    <ProfileListPageWrapper>
      <Page title={t('profileList')}>
        <PageTitle>{t('profileList')}</PageTitle>
        <PageActions>
          <Link to="/profile-editor">
            <Button><PlusIcon size={20}/>{t('user.create')}</Button>
          </Link>
          <Menu title={<><SelectMenuIcon size={20}/>{t('fastActions')}</>}>
            <MenuItem onClick={() => void setSelectedItems(data.map((item) => item._id))}>
              <CheckAllIcon size={20} />{t('selectAll')}
            </MenuItem>
            <MenuItem disabled={!selectedItems.length} onClick={() => void setSelectedItems([])}>
              <RemoveCheckIcon size={20} />{t('removeSelect')}
            </MenuItem>
            <Divider />
            <MenuItem disabled={!selectedItems.length} onClick={() => void setOpenPrintDialog(true)}>
              <PrintIcon size={20} />{t('docsTemplates.print')}
            </MenuItem>
            <Divider />
            <MenuItem>
              <Link to="/import-profiles">
                <UploadIcon size={20} />{t('user.import')}
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/export-profiles">
                <ExportIcon size={20} />{t('user.export')}
              </Link>
            </MenuItem>
          </Menu>
        </PageActions>
        <FiltersBar style={{ marginTop: 10 }}>
          <FilterAutocomplete options={usersFilter} getOptionLabel={(user) => `${user.name} ${user.surname}`} filterKey="_id" label={t('search')} />
          <FilterAutocomplete filterKey="project" label={t('user.project')} options={projects} labelKey="name" />
          <FilterSelect filterKey="status" label={t('user.status')} options={translatedStatuses} emptyItem={t('selectAll')} />
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
        <ListTable columns={COLUMNS} className="users-table">
          {pageItems.map((user: IUser) => (
            <ListTableRow key={user._id}>
              <ListTableCell>
                <Checkbox
                  checked={selectedItems.includes(user._id)}
                  data-id={user._id}
                  onChange={(e) => {
                    setSelectedItems((prev) => {
                      if (e.target.checked) {
                        return [...prev, user._id];
                      }
                      return prev.filter((item) => item !== user._id);
                    });
                  }}
                />
              </ListTableCell>
              <ListTableCell>
                <Link
                  to={`/profile/${user._id}`}
                  className="table-link"
                >
                  {user.name} {user.surname}
                </Link>
              </ListTableCell>
              <ListTableCell>{user.email}</ListTableCell>
              <ListTableCell>{typeof user.project === 'object' && user.project?.name}</ListTableCell>
              <ListTableCell>{user.status && (
                <p
                  style={{ color: STATUSES_COLORS[user.status] }}>
                  {t(`selects.userStatus.${user.status}`)}
                </p>
              )}</ListTableCell>
            </ListTableRow>
          ))}
        </ListTable>
        <Pagination {...paginationConfig} />
      </Page>
      {openPrintDialog && (
        <PrintDocDialog ids={selectedItems} open={openPrintDialog} onClose={() => void setOpenPrintDialog(false)} />
      )}
    </ProfileListPageWrapper>
  );
};

export default function ProfileListPage () {
  return (
    <FiltersProvider>
      <ProfileListPageRender />
    </FiltersProvider>
  );
};
