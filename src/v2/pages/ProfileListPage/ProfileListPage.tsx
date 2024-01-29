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
import { AiOutlineSearchIcon } from 'components/icons';
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
  const { data = [], refetch, remove, isFetching } = useGetUserList(debouncedFiltersState, { enabled: false });

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
            prefixIcon={<AiOutlineSearchIcon className="search-icon"/>}
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
                popperComponent: (onSelect) => (
                  <Autocomplete
                    style={{ minWidth: 300 }}
                    options={projects.filter((projectItem) => !projectsFilter.includes(projectItem._id))}
                    getOptionLabel={(option) => `${option.client?.name ? `${option.client?.name} > ` : ''}${option.name}`}
                    value={null}
                    onChange={(project: IProject) => {
                      onSelect(projectsFilter.length ? [...(new Set([...projectsFilter, project._id]))].toString() : project._id);
                    }}
                  />
                ),
              },
              {
                id: 'statuses',
                name: t('user.status'),
                popperComponent: (onSelect) => (
                  <Select
                    style={{ minWidth: 300 }}
                    options={translatedStatuses.filter((statusItem) => !statusesFilter.includes(statusItem.value))}
                    onChange={(e) => {
                      onSelect(statusesFilter.length ? [...(new Set([...statusesFilter, e.target.value]))].toString() : e.target.value);
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
          data={data}
          customFields={customFields}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          isFetching={isFetching}
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
