import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';

import { useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import PrintDocDialog, { UserData } from 'components/complex/PrintDocDialog';
import {
  CheckAllIcon, ExportIcon, PlusIcon, PrintIcon, RemoveCheckIcon,
  SelectMenuIcon, SettingsIcon, UploadIcon,
} from 'components/icons';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import { ClearFiLtersButton, FilterAutocomplete, FiltersBar, FiltersProvider, useFilters } from 'components/shared/Filters';
import ListTable from 'components/shared/ListTable';
import Menu, { Divider, MenuItem } from 'components/shared/Menu';
import Page, { PageActions, PageTitle } from 'components/shared/Page';
import Pagination from 'components/shared/Pagination';
import Select from 'components/shared/Select';
import { EXPORT_USER_FIELDS } from 'constants/userCsv';
import { STATUSES } from 'constants/userStatuses';
import useLocalStorageState from 'hooks/useLocalStorageState';
import useOutsideClick from 'hooks/useOutsideClick';
import usePaginatedList from 'hooks/usePaginatedList';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { ROWS_PER_PAGE_OPTIONS } from 'interfaces/table.types';
import { IUser } from 'interfaces/users.interface';

import ProfileRow from './ProfileRow';
import { ProfileListPageWrapper } from './styles';

const STATIC_COLS = [
  '',
  'user.name',
];

const COLS_TO_SETTINGS = EXPORT_USER_FIELDS.filter((item) => !['name', 'surname'].includes(item)).map((col) => `user.${col}`);

const DEFAULT_COLS = [
  'user.birthDate',
  'user.project',
  'user.status',
];

const ProfileListPageRender = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { debouncedFiltersState } = useFilters();

  const { data = [], refetch, remove } = useGetUserList(debouncedFiltersState, { enabled: false });
  const { data: usersFilter = [] } = useGetUserListForFilter();
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const { pageItems, paginationConfig } = usePaginatedList(data, { rowsPerPage });
  const { data: projects = [] } = useGetProjects();
  const { data: recruiters = [] } = useGetUserList({ role: 'recruiter' });
  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');
  const updateUserMutation = useUpdateUserMutation();

  const [selectedItems, setSelectedItems] = useState<UserData[]>([]);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  const [openColsSettins, setOpenColsSettings] = useState(false);
  const [storedColsSettings, setStoredColsSettings] = useLocalStorageState('profilesTableCols');
  const [activeCols, setActiveCols] = useState<string[]>(storedColsSettings ? JSON.parse(storedColsSettings).cols : DEFAULT_COLS);
  const colsSettingsRef = useRef<HTMLDivElement>(null);
  useOutsideClick(colsSettingsRef, () => {
    setOpenColsSettings(false);
  });

  const toggleColumnsSettings = () => {
    setOpenColsSettings((prev) => !prev);
  };

  const [editingRow, setEditingRow] = useState<null | string>(null);

  const updateUser = (values: Partial<IUser>) => {
    if (values._id) {
      updateUserMutation.mutate({ ...values, _id: values._id });
      const project = projects.find((item) => item._id === values.project) || null;
      const recruiter = recruiters.find((item) => item._id === values.recruiter) || null;

      queryClient.setQueryData(
        ['users', JSON.stringify(debouncedFiltersState)],
        data.map((userItem) => {
          if (userItem._id === values._id) {
            return { ...userItem, ...values, project, recruiter };
          }
          return userItem;
        }),
      );
    }
  };

  useEffect(() => {
    if (debouncedFiltersState) {
      refetch();
    }
    return () => { remove(); };
  }, [debouncedFiltersState, refetch, remove]);

  useEffect(() => {
    setStoredColsSettings(JSON.stringify({ cols: activeCols }));
  }, [activeCols, setStoredColsSettings]);

  return (
    <ProfileListPageWrapper cols={activeCols.length + 1}>
      <Page title={t('profileList')}>
        <PageTitle>{t('profileList')}</PageTitle>
        <PageActions>
          <Link to="/create-profile">
            <Button><PlusIcon size={20}/>{t('user.create')}</Button>
          </Link>
          <Menu title={<><SelectMenuIcon size={20}/>{t('fastActions')}</>}>
            <MenuItem onClick={() => void setSelectedItems(data)}>
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
            <Link to="/import-profiles">
              <MenuItem>
                <UploadIcon size={20} />{t('user.import')}
              </MenuItem>
            </Link>
            <Link to="/export-profiles">
              <MenuItem>
                <ExportIcon size={20} />{t('user.export')}
              </MenuItem>
            </Link>
          </Menu>
        </PageActions>
        <FiltersBar style={{ marginTop: 10 }}>
          <FilterAutocomplete
            multiple
            options={usersFilter}
            getOptionLabel={(user) => `${user.name} ${user.surname}`}
            filterKey="ids"
            label={t('search')}
          />
          <FilterAutocomplete
            multiple
            filterKey="projects"
            label={t('user.project')}
            options={projects}
            labelKey="name"
          />
          <FilterAutocomplete
            multiple
            filterKey="statuses"
            label={t('user.status')}
            options={translatedStatuses}
            labelKey="label"
          />
          <ClearFiLtersButton />
          <div className="table-settings-wrapper">
            <div className="cols-settings-wrapper" ref={colsSettingsRef}>
              <IconButton onClick={toggleColumnsSettings}><SettingsIcon /></IconButton>
              {openColsSettins && (
                <div className="cols-settings">
                  <Checkbox
                    title={t('selectAll')}
                    checked={activeCols.length === COLS_TO_SETTINGS.length}
                    onChange={(e) => void setActiveCols(() => {
                      if (e.target.checked) {
                        return COLS_TO_SETTINGS;
                      } else {
                        return DEFAULT_COLS;
                      }
                    })}
                  />
                  {COLS_TO_SETTINGS.map((field) => (
                    <Checkbox
                      key={field}
                      title={t(field)}
                      checked={activeCols.includes(field)}
                      onChange={(e) => void setActiveCols((prev) => {
                        if (e.target.checked) {
                          return [...prev, field];
                        } else {
                          return prev.filter((item) => item !== field);
                        }
                      })}
                    />
                  ))}
                </div>
              )}
            </div>
            <Select
              label={t('rowsPerPage')}
              value={rowsPerPage}
              options={ROWS_PER_PAGE_OPTIONS}
              onChange={(e) => void setRowsPerPage(e.target.value as number)}
              style={{ minWidth: 200 }}
            />
          </div>
        </FiltersBar>
        <ListTable columns={[...STATIC_COLS, ...activeCols, '']} className="users-table">
          {pageItems.map((user: IUser) => (
            <ProfileRow
              key={user._id}
              data={user}
              editingMode={editingRow === user._id}
              startEdit={() => void setEditingRow(user._id)}
              saveEdit={(values) => {
                setEditingRow(null);
                updateUser(values);
              }}
              cols={activeCols}
              selected={selectedItems.some((item) => item._id === user._id)}
              onChangeSelect={(checked) => {
                setSelectedItems((prev) => {
                  if (checked) {
                    const { _id, name, surname } = user;
                    return [...prev, { _id, name, surname }];
                  }
                  return prev.filter((item) => item._id !== user._id);
                });
              }}
            />
          ))}
        </ListTable>
        <Pagination {...paginationConfig} />
      </Page>
      {openPrintDialog && (
        <PrintDocDialog users={selectedItems} open={openPrintDialog} onClose={() => void setOpenPrintDialog(false)} />
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
