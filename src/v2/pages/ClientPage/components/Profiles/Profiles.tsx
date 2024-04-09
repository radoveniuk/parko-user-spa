import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PrintDocDialog from 'v2/components/PrintDocDialog';
import Autocomplete from 'v2/uikit/Autocomplete';

import { SearchIcon } from 'components/icons';
import { FiltersProvider } from 'components/shared/Filters';
import { USER_EMPLOYMENT_STATUSES, USER_STATUSES } from 'constants/statuses';
import useLocalStorageState from 'hooks/useLocalStorageState';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IEmployment } from 'interfaces/employment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import HeaderTable from './HeaderTable';
import { FilterTableWrapper, ProfilesWrapper } from './styles';
import Table from './Table';

type Props = {
  employments: IEmployment[];
  projects: IProject[];
};

const Profiles = ({ employments, projects }: Props) => {
  const { t } = useTranslation();

  const [employmentStatusFilter, setEmploymentStatusFilter] = useState<string[]>([]);
  const [usersFilter, setUsersFilter] = useState<string[]>([]);
  const [projectsFilter, setProjectsFilter] = useState<IProject[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const [selectedItems, setSelectedItems] = useState<IUser[]>([]);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');
  const translatedEmploymentStatuses = useTranslatedSelect(USER_EMPLOYMENT_STATUSES, 'userPositionEmploymentStatus');
  const [storedColsSettings] = useLocalStorageState('clientProfilesTableCols');
  const [activeCols, setActiveCols] = useState<string[]>(storedColsSettings ? JSON.parse(storedColsSettings).cols : ['user.status']);

  const users = useMemo(() => {
    let filteredData = [...employments];
    if (usersFilter.length) {
      filteredData = filteredData.filter((employment) => usersFilter.includes(employment.user._id));
    }
    if (projectsFilter.length) {
      filteredData = filteredData.filter((employment) => projectsFilter.some(project => project?._id === (employment.project as IProject)?._id));
    }
    if (statusFilter.length) {
      filteredData = filteredData.filter((employment) => statusFilter.includes(employment.user.status));
    }
    if (employmentStatusFilter.length) {
      filteredData = filteredData.filter((employment) => employmentStatusFilter.includes(employment.status as string));
    }
    return filteredData.map((employment) => ({ ...employment.user, employmentStatus: employment.status }));
  }, [employmentStatusFilter, employments, projectsFilter, statusFilter, usersFilter]);

  return (
    <FiltersProvider>
      <ProfilesWrapper cols={activeCols.length + 1}>
        <HeaderTable
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setOpenPrintDialog={setOpenPrintDialog}
          data={users}
        />
        <FilterTableWrapper>
          <Autocomplete
            multiple
            options={employments.map((employment) => employment.user)}
            getOptionLabel={(user) => `${user.name} ${user.surname}`}
            prefixIcon={<SearchIcon className="search-icon"/>}
            className="filter-name"
            limitTags={1}
            theme="gray"
            label={t('search')}
            value={employments.filter((employment) => usersFilter.includes(employment.user._id)).map((employment) => employment.user)}
            onChange={(v) => {
              setUsersFilter(v.map((user: IUser) => user._id));
            }}
          />
          <Autocomplete
            multiple
            theme="gray"
            label={t('user.project')}
            options={projects.filter(project => !projectsFilter.some(projectFromFilter => projectFromFilter._id === project._id))}
            getOptionLabel={(option) => option.name}
            onChange={setProjectsFilter}
            value={projectsFilter}
          />
          <Autocomplete
            multiple
            theme="gray"
            label={t('user.employmentStatus')}
            options={translatedEmploymentStatuses}
            labelKey="label"
            valueKey="value"
            onChange={(v) => void setEmploymentStatusFilter(v.map((item: { value: string; }) => item.value))}
          />
          <Autocomplete
            multiple
            theme="gray"
            label={t('user.status')}
            options={translatedStatuses.filter(status => !statusFilter.some(statusFromFilter => statusFromFilter === status.value))}
            onChange={(v) => void setStatusFilter(v.map((item: { value: string; }) => item.value))}
            labelKey="label"
            valueKey="value"
          />
        </FilterTableWrapper>
        <Table
          activeCols={activeCols}
          setActiveCols={setActiveCols}
          data={users}
          customFields={[]}
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
