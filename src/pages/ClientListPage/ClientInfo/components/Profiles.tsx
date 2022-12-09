import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useGetDictionary } from 'api/query/dictionariesQuery';
import { useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import Checkbox from 'components/shared/Checkbox';
import { FilterAutocomplete, FiltersBar, FilterSelect, useFilters } from 'components/shared/Filters';
import { ClearFiLtersButton, FilterDate } from 'components/shared/Filters/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Pagination from 'components/shared/Pagination';
import Select from 'components/shared/Select';
import { EMPLOYMENT_TYPE } from 'constants/selectsOptions';
import { STATUSES, STATUSES_COLORS } from 'constants/userStatuses';
import { getDateFromIso } from 'helpers/datetime';
import usePaginatedList from 'hooks/usePaginatedList';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IProject } from 'interfaces/project.interface';
import { ROWS_PER_PAGE_OPTIONS } from 'interfaces/table.types';
import { IUser } from 'interfaces/users.interface';

import { useGetClientInfo, useSelectedProfiles } from '../ClientInfoContext';

const COLS = ['', 'user.project', 'user.name', 'user.employmentType', 'user.position',
  'user.cooperationStartDate', 'user.cooperationEndDate', 'user.status'];

export default function Profiles () {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useSelectedProfiles();

  // filters
  const { projects = [] } = useGetClientInfo();
  const { data: profilesFilter = [] } = useGetUserListForFilter({ projects: (projects?.map((item) => item._id) || []).join(',') });
  const employmentTypeOptions = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType');
  const statusOptions = useTranslatedSelect(STATUSES, 'userStatus');
  const { data: profilePositionDictionary } = useGetDictionary('PROFILE_POSITIONS');

  const prepareUserToExport = (user: IUser): IUser => ({
    ...user,
    cooperationStartDate: getDateFromIso(user.cooperationStartDate),
    cooperationEndDate: getDateFromIso(user.cooperationEndDate),
    status: t(`selects.userStatus.${user.status}`),
    employmentType: t(`selects.employmentType.${user.employmentType}`),
  });

  const { debouncedFiltersState } = useFilters();
  const {
    data: profiles = [],
    refetch: refetchProfiles,
  } = useGetUserList({ projects: (projects?.map((item) => item._id) || []).join(','), ...debouncedFiltersState });

  useEffect(() => {
    if (debouncedFiltersState) {
      refetchProfiles();
    }
  }, [debouncedFiltersState, refetchProfiles]);

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const { pageItems: pageProfiles, paginationConfig } = usePaginatedList(profiles, { rowsPerPage });

  return (
    <>
      <FiltersBar>
        <FilterAutocomplete
          multiple
          options={profilesFilter}
          getOptionLabel={(user) => `${user.name} ${user.surname}`}
          filterKey="ids"
          label={t('search')}
        />
        <FilterAutocomplete options={projects} filterKey="projects" label={t('user.project')} labelKey="name" multiple />
        <FilterSelect
          options={profilePositionDictionary?.options || []}
          filterKey="position"
          label={t('user.position')}
        />
        <FilterSelect
          options={statusOptions}
          filterKey="status"
          label={t('user.status')}
        />
        <FilterSelect
          options={employmentTypeOptions}
          filterKey="employmentType"
          label={t('user.employmentType')}
        />
        <FilterDate
          filterKey="cooperationFrom"
          label={t('project.cooperationFrom')}
        />
        <FilterDate
          filterKey="cooperationTo"
          label={t('project.cooperationTo')}
        />
        <ClearFiLtersButton />
        <div className="table-settings">
          <Select
            label={t('rowsPerPage')}
            value={rowsPerPage}
            options={ROWS_PER_PAGE_OPTIONS}
            onChange={(e) => void setRowsPerPage(e.target.value as number)}
            style={{ minWidth: 200 }}
          />
        </div>
      </FiltersBar>
      <ListTable columns={COLS} className="users-table">
        {pageProfiles.map((user) => (
          <ListTableRow key={user._id}>
            <ListTableCell>
              <Checkbox
                checked={selectedItems.some((item) => item._id === user._id)}
                onChange={(e) => {
                  const { checked } = e.target;
                  setSelectedItems((prev) => {
                    if (checked) {
                      return [...prev, prepareUserToExport(user)];
                    }
                    return prev.filter((item) => item._id !== user._id);
                  });
                }}
              />
            </ListTableCell>
            <ListTableCell>
              <Link to={`/profile/${user._id}`} className="table-link" >
                {user.name} {user.surname}
              </Link>
            </ListTableCell>
            <ListTableCell>
              {user.project && (
                <Link to={`/projects?id=${(user.project as IProject)._id}`} className="table-link" >
                  {(user.project as IProject).name}
                </Link>
              )}
            </ListTableCell>
            <ListTableCell>{!!user.employmentType && t(`selects.employmentType.${user.employmentType}`)}</ListTableCell>
            <ListTableCell>{user.position}</ListTableCell>
            <ListTableCell>{getDateFromIso(user.cooperationStartDate)}</ListTableCell>
            <ListTableCell>{getDateFromIso(user.cooperationEndDate)}</ListTableCell>
            <ListTableCell color={STATUSES_COLORS[user.status]}>{t(`selects.userStatus.${user.status}`)}</ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
      <Pagination {...paginationConfig} />
    </>
  );
};
