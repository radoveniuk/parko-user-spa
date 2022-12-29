import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useGetDictionary } from 'api/query/dictionariesQuery';
import { useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import PrintDocDialog from 'components/complex/PrintDocDialog';
import { CheckAllIcon, ExcelIcon, PrintIcon, RemoveCheckIcon } from 'components/icons';
import Checkbox from 'components/shared/Checkbox';
import { FilterAutocomplete, FiltersBar, FilterSelect, useFilters } from 'components/shared/Filters';
import { ClearFiLtersButton, FilterDate } from 'components/shared/Filters/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Menu, { Divider, MenuItem } from 'components/shared/Menu';
import Pagination from 'components/shared/Pagination';
import Select from 'components/shared/Select';
import { EMPLOYMENT_TYPE } from 'constants/selectsOptions';
import { STATUSES_COLORS, USER_STATUSES } from 'constants/statuses';
import { getDateFromIso } from 'helpers/datetime';
import { useExportData } from 'hooks/useExportData';
import usePaginatedList from 'hooks/usePaginatedList';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IProject } from 'interfaces/project.interface';
import { ROWS_PER_PAGE_OPTIONS } from 'interfaces/table.types';
import { IUser } from 'interfaces/users.interface';

import { useGetClientInfo, useSelectedProfiles } from '../ClientInfoContext';

const COLS = ['', 'user.name', 'user.project', 'user.employmentType', 'user.position',
  'user.cooperationStartDate', 'user.cooperationEndDate', 'user.status'];

export default function Profiles () {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useSelectedProfiles();

  // filters
  const { projects = [] } = useGetClientInfo();
  const { data: profilesFilter = [] } = useGetUserListForFilter({ projects: (projects?.map((item) => item._id) || []).join(',') });
  const employmentTypeOptions = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType');
  const statusOptions = useTranslatedSelect(USER_STATUSES, 'userStatus');
  const { data: profilePositionDictionary } = useGetDictionary('PROFILE_POSITIONS');

  const prepareUserToExport = (user: IUser): IUser => ({
    ...user,
    cooperationStartDate: getDateFromIso(user.cooperationStartDate),
    cooperationEndDate: getDateFromIso(user.cooperationEndDate),
    status: t(`selects.userStatus.${user.status}`),
    employmentType: t(`selects.employmentType.${user.employmentType}`),
    project: (user.project as IProject).name,
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

  // export
  const exportData = useExportData({
    data: selectedItems,
    colsToExport: COLS.filter((col) => !!col).map((col) => col.replace('user.', '')),
    cols: COLS.filter((col) => !!col).map((col) => col.replace('user.', '')),
    entity: 'user',
  });

  // print
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  return (
    <>
      <div className="table-actions">
        <Menu>
          <MenuItem onClick={() => void setSelectedItems(profiles)}>
            <CheckAllIcon size={20} />{t('selectAll')}
          </MenuItem>
          <MenuItem disabled={!selectedItems.length} onClick={() => void setSelectedItems([])}>
            <RemoveCheckIcon size={20} />{t('removeSelect')}
          </MenuItem>
          <Divider />
          <MenuItem disabled={!selectedItems.length} onClick={() => void setOpenPrintDialog(true)} >
            <PrintIcon size={20} />{t('docsTemplates.print')}
          </MenuItem>
          <Divider />
          <MenuItem disabled={!selectedItems.length} onClick={() => void exportData('xlsx')}>
            <ExcelIcon size={20} />{t('user.export')}
          </MenuItem>
        </Menu>
      </div>
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
      {openPrintDialog && (
        <PrintDocDialog users={selectedItems} open={openPrintDialog} onClose={() => void setOpenPrintDialog(false)} />
      )}
    </>
  );
};
