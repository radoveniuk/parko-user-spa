import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';
import { useGetProjects } from 'api/query/projectQuery';
import List from 'components/shared/List';
import { ProjectsListWrapper } from './styles';
import { FiltersBar, FiltersProvider, FilterText, useFilters } from 'components/shared/Filters';
import Button from 'components/shared/Button';
import { Link } from 'react-router-dom';
import useDebounce from 'hooks/useDebounce';

const fields = {
  primary: 'name',
};

const ProjectListPageRender = () => {
  const { t } = useTranslation();
  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);
  const { data = [], refetch } = useGetProjects(debouncedFiltersState);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <Page title={t('projectList')}>
      <PageTitle>{t('projectList')}</PageTitle>
      <FiltersBar>
        <FilterText filterKey="search" label={t('search')} />
        <Link to="/project" style={{ marginLeft: 'auto' }}>
          <Button color="secondary">{t('project.new')}</Button>
        </Link>
      </FiltersBar>
      <ProjectsListWrapper>
        <List
          className="projects-list"
          data={data}
          fields={fields}
          onSelect={(project) => void setSelectedProject(project)}
        />
        {selectedProject !== null && (
          <div>
            project data
          </div>
        )}
      </ProjectsListWrapper>
    </Page>
  );
};

export default function ProjectListPage () {
  return (
    <FiltersProvider>
      <ProjectListPageRender />
    </FiltersProvider>
  );
};
