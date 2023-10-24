import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddFilterButton from 'v2/components/Filters/AddFilterButton';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import PrintDocDialog from 'components/complex/PrintDocDialog';
import { AiOutlineSearchIcon } from 'components/icons';
import Autocomplete from 'components/shared/Autocomplete';
import Chip from 'v2/uikit/Chip';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';
import Select from 'components/shared/Select';
import { USER_STATUSES } from 'constants/statuses';
import useLocalStorageState from 'hooks/useLocalStorageState';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import HeaderTable from './components/HeaderTable';
import Table from './components/Table';
import { FilterTableWrapper, ProfileListPageWrapper } from './styles';

const DEFAULT_COLS = [
  'user.email',
];

const ProfileListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('profileList'));

  const { debouncedFiltersState, filtersState, removeFilter } = useFilters();

  // table content
  const { data = [], refetch, remove } = useGetUserList(debouncedFiltersState, { enabled: false });

  // filters
  const { data: usersFilter = [] } = useGetUserListForFilter();
  const { data: projects = [] } = useGetProjects();
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');

  const [selectedItems, setSelectedItems] = useState<IUser[]>([]);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  const [storedColsSettings, setStoredColsSettings] = useLocalStorageState('profilesTableCols');
  const [activeCols, setActiveCols] = useState<string[]>(storedColsSettings ? JSON.parse(storedColsSettings).cols : DEFAULT_COLS);

  // custom cols
  const { data: customFields = [] } = useGetCustomFormFields({ entity: 'user' });

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
      <div className="container-table">
        <HeaderTable
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setOpenPrintDialog={setOpenPrintDialog}
          data={data}
          activeCols={activeCols}
          customFields={customFields}
        />
        <FilterTableWrapper>
          <FilterAutocomplete
            multiple
            options={usersFilter}
            getOptionLabel={user => `${user.name} ${user.surname}`}
            filterKey="ids"
            label={t('search')}
            prefixIcon={<AiOutlineSearchIcon className="search-icon"/>}
            className="filter-name"
            limitTags={1}
            placeholder={t('search')}
          />
          {!!filtersState?.project && (
            <Chip
              className="filter-chip"
              label={`${t('user.project')}: ${projects.find(project => project._id === filtersState.project)?.name}`}
              onDelete={() => void removeFilter('project')}
            />
          )}
          {!!filtersState?.status && (
            <Chip
              className="filter-chip"
              label={`${t('user.status')}: ${translatedStatuses.find(status => status.value === filtersState?.status)?.label}`}
              onDelete={() => void removeFilter('status')}
            />
          )}
          <AddFilterButton
            filterOptions={[
              {
                id: 'project',
                name: t('user.project'),
                popperComponent: (onSelect) => (
                  <Autocomplete
                    style={{ minWidth: 300 }}
                    options={projects}
                    getOptionLabel={(option) => option.name}
                    onChange={(project: IProject) => void onSelect(project._id)}
                  />
                ),
              },
              {
                id: 'status',
                name: t('user.status'),
                popperComponent: (onSelect) => (
                  <Select
                    style={{ minWidth: 300 }}
                    options={translatedStatuses}
                    onChange={(e) => void onSelect(e.target.value)}
                  />
                ),
              },
            ]}
          />
        </FilterTableWrapper>
        <Table
          activeCols={activeCols}
          setActiveCols={setActiveCols}
          data={data}
          customFields={customFields}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
        />
      </div>
      {openPrintDialog && (
        <PrintDocDialog
          users={selectedItems}
          open={openPrintDialog}
          onClose={() => void setOpenPrintDialog(false)}
        />
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
