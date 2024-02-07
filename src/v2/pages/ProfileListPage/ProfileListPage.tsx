import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddFilterButton from 'v2/components/Filters/AddFilterButton';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import Autocomplete from 'v2/uikit/Autocomplete';
import Chip from 'v2/uikit/Chip';
import Select from 'v2/uikit/Select';

import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import PrintDocDialog from 'components/complex/PrintDocDialog';
import { SearchIcon } from 'components/icons';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';
import { USER_STATUSES } from 'constants/statuses';
import useLocalStorageState from 'hooks/useLocalStorageState';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import HeaderTable from './components/HeaderTable';
import Table from './components/Table';
import { FilterTableWrapper, ProfileListPageWrapper } from './styles';

const DEFAULT_COLS = ['user.email'];

const ProfileListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('profileList'));

  const { debouncedFiltersState, filtersState, removeFilter, addFilter } = useFilters();

  // table content
  const { data: startData = [], isFetching: isFetchingStartData } = useGetUserList({ take: 20, skip: 0 }, { enabled: true });
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

  const projectsFilter = filtersState?.projects?.split(',') || [];
  const statusesFilter = filtersState?.statuses?.split(',') || [];

  // console.log(projects.filter((projectItem) => !filtersState?.projects?.includes(projectItem._id)));

  return (
    <ProfileListPageWrapper cols={activeCols.length + 1}>
      <div className="container-table">
        <HeaderTable
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setOpenPrintDialog={setOpenPrintDialog}
          data={!data.length ? startData : data}
          activeCols={activeCols}
          customFields={customFields}
          loading={!data.length}
        />
        <FilterTableWrapper>
          <FilterAutocomplete
            multiple
            options={usersFilter}
            getOptionLabel={user => `${user.name} ${user.surname}`}
            filterKey="ids"
            prefixIcon={<SearchIcon className="search-icon"/>}
            className="filter-name"
            limitTags={1}
            placeholder={t('search')}
          />
          {projectsFilter?.map((projectId) => {
            const project = projects.find(project => project._id === projectId) as IProject;
            const client = project?.client as IClient | null;
            return (
              <Chip
                key={projectId}
                label={`${t('user.project')}: ${client ? `${client.name} > ` : ''}${project?.name}`}
                onDelete={() => projectsFilter.length > 1
                  ? addFilter('projects', projectsFilter.filter((id) => id !== projectId).toString())
                  : removeFilter('projects')}
                className="filter-chip"
              />
            );
          })}
          {statusesFilter?.map((statusName) => (
            <Chip
              key={statusName}
              label={`${t('user.status')}: ${translatedStatuses.find(status => status.value === statusName)?.label}`}
              onDelete={() => statusesFilter.length > 1
                ? addFilter('statuses', statusesFilter.filter((name) => name !== statusName).toString())
                : removeFilter('statuses')}
              className="filter-chip"
            />
          ))}
          <AddFilterButton
            filterOptions={[
              {
                id: 'projects',
                name: t('user.project'),
                popperComponent: (onSelect, currentValue) => (
                  <Autocomplete
                    theme="gray"
                    style={{ minWidth: 300 }}
                    options={projects.filter((projectItem) => !currentValue?.includes(projectItem._id))}
                    getOptionLabel={(option) => `${option.client?.name ? `${option.client?.name} > ` : ''}${option.name}`}
                    value={null}
                    onChange={(project: IProject) => {
                      onSelect(project._id);
                    }}
                  />
                ),
              },
              {
                id: 'statuses',
                name: t('user.status'),
                popperComponent: (onSelect, currentValue) => (
                  <Select
                    theme="gray"
                    style={{ minWidth: 300 }}
                    options={translatedStatuses.filter((statusItem) => !currentValue?.includes(statusItem.value))}
                    onChange={(e) => {
                      onSelect(e.target.value);
                    }}
                  />
                ),
              },
            ]}
          />
        </FilterTableWrapper>
        <Table
          activeCols={activeCols}
          setActiveCols={setActiveCols}
          data={!data.length ? startData : data}
          customFields={customFields}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          isFetching={isFetchingStartData}
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
