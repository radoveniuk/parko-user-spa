import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddFilterButton from 'v2/components/Filters/AddFilterButton';
import Autocomplete from 'v2/uikit/Autocomplete';
import Chip from 'v2/uikit/Chip';
import Select from 'v2/uikit/Select';

import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import PrintDocDialog from 'components/complex/PrintDocDialog';
import { AiOutlineSearchIcon } from 'components/icons';
import { FiltersProvider } from 'components/shared/Filters';
import { USER_STATUSES } from 'constants/statuses';
import useListState from 'hooks/useListState';
import useLocalStorageState from 'hooks/useLocalStorageState';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import HeaderTable from './HeaderTable';
import { FilterTableWrapper, ProfilesWrapper } from './styles';
import Table from './Table';

type Props = {
  users: IUser[];
  projects: IProject[];
};

const Profiles = ({ users: data, projects }: Props) => {
  const { t } = useTranslation();

  const [usersFilter,, setUsersFilter] = useListState<string>([]);
  const [projectsFilter, { add: addProjectToFilter, remove: removeProjectFromFilter }] = useListState<IProject>([]);
  const [statusFilter, { add: addStatusToFilter, remove: removeStatusFromFilter }] = useListState<string>([]);

  const [selectedItems, setSelectedItems] = useState<IUser[]>([]);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');
  const [storedColsSettings] = useLocalStorageState('profilesTableCols');
  const [activeCols, setActiveCols] = useState<string[]>(storedColsSettings ? JSON.parse(storedColsSettings).cols : ['user.email']);
  // custom cols
  const { data: customFields = [] } = useGetCustomFormFields({ entity: 'user' });

  const users = useMemo(() => {
    let filteredData = [...data];
    if (usersFilter.length) {
      filteredData = filteredData.filter((user) => usersFilter.includes(user._id));
    }
    if (projectsFilter.length) {
      filteredData = filteredData.filter((user) => projectsFilter.some(project => project?._id === (user.project as IProject)?._id));
    }
    if (statusFilter.length) {
      filteredData = filteredData.filter((user) => statusFilter.includes(user.status));
    }
    return filteredData;
  }, [data, projectsFilter, statusFilter, usersFilter]);

  return (
    <FiltersProvider>
      <ProfilesWrapper cols={activeCols.length + 1}>
        <HeaderTable
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setOpenPrintDialog={setOpenPrintDialog}
          data={data}
        />
        <FilterTableWrapper>
          <Autocomplete
            multiple
            options={data}
            getOptionLabel={user => `${user.name} ${user.surname}`}
            prefixIcon={<AiOutlineSearchIcon className="search-icon"/>}
            className="filter-name"
            limitTags={1}
            placeholder={t('search')}
            value={data.filter((user) => usersFilter.includes(user._id))}
            onChange={(v) => {
              setUsersFilter(v.map((user: IUser) => user._id));
            }}
          />
          {projectsFilter.map((project) => (
            <Chip
              key={project?._id}
              label={`${t('user.project')}: ${project?.name}`}
              onDelete={() => void removeProjectFromFilter(project)}
            />
          ))}
          {statusFilter.map((status) => (
            <Chip
              key={status}
              label={`${t('user.status')}: ${translatedStatuses.find(translatedItem => translatedItem.value === status)?.label}`}
              onDelete={() => void removeStatusFromFilter(status)}
            />
          ))}
          <AddFilterButton
            filterOptions={[
              {
                id: 'project',
                name: t('user.project'),
                popperComponent: (onSelect) => (
                  <Autocomplete
                    style={{ minWidth: 300 }}
                    options={projects.filter(project => !projectsFilter.some(projectFromFilter => projectFromFilter._id === project._id))}
                    getOptionLabel={(option) => option.name}
                    onChange={(project: IProject) => {
                      onSelect();
                      addProjectToFilter(project);
                    }}
                  />
                ),
              },
              {
                id: 'status',
                name: t('user.status'),
                popperComponent: (onSelect) => (
                  <Select
                    style={{ minWidth: 300 }}
                    options={translatedStatuses.filter(status => !statusFilter.some(statusFromFilter => statusFromFilter === status.value))}
                    onChange={(e) => {
                      onSelect();
                      addStatusToFilter(e.target.value as string);
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
          data={users}
          customFields={customFields}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
        />
        {openPrintDialog && (
          <PrintDocDialog users={selectedItems} open={openPrintDialog} onClose={() => void setOpenPrintDialog(false)} />
        )}
      </ProfilesWrapper>
    </FiltersProvider>
  );
};

export default Profiles;
