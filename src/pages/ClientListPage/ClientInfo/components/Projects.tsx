import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { isEmpty, isUndefined } from 'lodash-es';

import { CheckAllIcon, ExcelIcon, RemoveCheckIcon } from 'components/icons';
import Checkbox from 'components/shared/Checkbox';
import { ClearFiLtersButton, FilterAutocomplete, FiltersBar, FilterSelect, useFilters } from 'components/shared/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Menu, { Divider, MenuItem } from 'components/shared/Menu';
import { PROJECT_STATUS } from 'constants/selectsOptions';
import { getDateFromIso } from 'helpers/datetime';
import { useExportData } from 'hooks/useExportData';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

import { useGetClientInfo, useSelectedProjects } from '../ClientInfoContext';

const COLS = ['', 'project.name', 'project.dateStart', 'project.status'];

export default function Projects () {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useSelectedProjects();
  const { projects = [] } = useGetClientInfo();

  const statusesFilter = useTranslatedSelect(PROJECT_STATUS, 'projectStatus');

  const { filtersState } = useFilters();

  const tableProjects = useMemo(() => {
    if (isEmpty(filtersState) || isUndefined(filtersState)) return projects;

    let filteredProjects = [...projects];
    if (filtersState.projectId) {
      filteredProjects = filteredProjects.filter((project) => filtersState.projectId.includes(project._id));
    }
    if (filtersState.projectStatus) {
      filteredProjects = filteredProjects.filter((project) => filtersState.projectStatus === project.status);
    }
    return filteredProjects;
  }, [filtersState, projects]);

  // export
  const exportData = useExportData({
    data: selectedItems.map((project) => ({
      ...project,
      status: project.status ? t(`selects.projectStatus.${project.status}`) : '',
      dateStart: getDateFromIso(project.dateStart),
    })),
    colsToExport: COLS.filter((col) => !!col).map((col) => col.replace('project.', '')),
    cols: COLS.filter((col) => !!col).map((col) => col.replace('project.', '')),
    entity: 'project',
  });

  return (
    <>
      <div className="table-actions">
        <Menu>
          <MenuItem onClick={() => void setSelectedItems(tableProjects)}>
            <CheckAllIcon size={20} />{t('selectAll')}
          </MenuItem>
          <MenuItem disabled={!selectedItems.length} onClick={() => void setSelectedItems([])}>
            <RemoveCheckIcon size={20} />{t('removeSelect')}
          </MenuItem>
          <Divider />
          <MenuItem disabled={!selectedItems.length} onClick={() => void exportData('xlsx')}>
            <ExcelIcon size={20} />{t('user.export')}
          </MenuItem>
        </Menu>
      </div>
      <FiltersBar>
        <FilterAutocomplete options={projects} filterKey="projectId" label={t('project.name')} labelKey="name" multiple />
        <FilterSelect options={statusesFilter} filterKey="projectStatus" label={t('project.status')} />
        <ClearFiLtersButton />
      </FiltersBar>
      <ListTable columns={COLS} className="projects-table">
        {tableProjects.map((project) => (
          <ListTableRow key={project._id}>
            <ListTableCell>
              <Checkbox
                checked={selectedItems.some((item) => item._id === project._id)}
                onChange={(e) => {
                  const { checked } = e.target;
                  setSelectedItems((prev) => {
                    if (checked) {
                      return [...prev, project];
                    }
                    return prev.filter((item) => item._id !== project._id);
                  });
                }}
              />
            </ListTableCell>
            <ListTableCell>
              <Link to={`/projects?id=${project._id}`} className="table-link" >
                {project.name}
              </Link>
            </ListTableCell>
            <ListTableCell>{getDateFromIso(project.dateStart)}</ListTableCell>
            <ListTableCell>{project.status && t(`selects.projectStatus.${project.status}`)}</ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
    </>
  );
};
