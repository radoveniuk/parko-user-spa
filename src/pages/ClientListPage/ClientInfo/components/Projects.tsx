import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { isEmpty, isUndefined } from 'lodash-es';

import Checkbox from 'components/shared/Checkbox';
import { ClearFiLtersButton, FilterAutocomplete, FiltersBar, FilterSelect, useFilters } from 'components/shared/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';

import { useGetClientInfo, useSelectedProjects } from '../ClientInfoContext';

const COLS = ['', 'project.name', 'project.dateStart', 'project.status'];

export default function Projects () {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useSelectedProjects();
  const { projects = [] } = useGetClientInfo();

  const statuses = useMemo(() => {
    const values = new Set();
    projects.forEach((item) => {
      if (item.status) {
        values.add(item.status);
      }
    });
    return Array.from(values) as string[];
  }, [projects]);

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

  return (
    <>
      <FiltersBar>
        <FilterAutocomplete options={projects} filterKey="projectId" label={t('project.name')} labelKey="name" multiple />
        <FilterSelect options={statuses} filterKey="projectStatus" label={t('project.status')} />
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
            <ListTableCell>{project.status}</ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
    </>
  );
};
