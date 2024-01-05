import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import AddFilterButton from 'v2/components/Filters/AddFilterButton';
import Autocomplete from 'v2/uikit/Autocomplete';
import Chip from 'v2/uikit/Chip';
import Select from 'v2/uikit/Select';

import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import { AiOutlineSearchIcon } from 'components/icons';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';
import { USER_STATUSES } from 'constants/statuses';
import useLocalStorageState from 'hooks/useLocalStorageState';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import HeaderTable from './HeaderTable';
import { FilterTableWrapper, ProfilesWrapper } from './styles';
import Table from './Table';

const ProfilesRender = () => {
  const { t } = useTranslation();

  const { id: clientId } = useParams();

  const { debouncedFiltersState, filtersState, removeFilter } = useFilters();
  const { data = [], refetch, remove } = useGetUserList(debouncedFiltersState, { enabled: true });

  const [selectedItems, setSelectedItems] = useState<IUser[]>([]);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const { data: usersFilter = [] } = useGetUserListForFilter();
  const { data: projects = [] } = useGetProjects({ client: clientId });
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');
  const [storedColsSettings, setStoredColsSettings] = useLocalStorageState('profilesTableCols');
  const [activeCols, setActiveCols] = useState<string[]>(storedColsSettings ? JSON.parse(storedColsSettings).cols : ['user.email']);
  // custom cols
  const { data: customFields = [] } = useGetCustomFormFields({ entity: 'user' });
  return (
    <ProfilesWrapper>
      <HeaderTable
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setOpenPrintDialog={setOpenPrintDialog}
        data={data}
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
        {!!filtersState?.project && (
          <Chip
            label={`${t('user.project')}: ${projects.find(project => project._id === filtersState.project)?.name}`}
            onDelete={() => void removeFilter('project')}
          />
        )}
        {!!filtersState?.status && (
          <Chip
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
    </ProfilesWrapper>
  );
};

export default function Profiles () {
  return (
    <FiltersProvider>
      <ProfilesRender />
    </FiltersProvider>
  );
};
