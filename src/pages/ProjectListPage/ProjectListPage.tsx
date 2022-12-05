import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { useGetProjects } from 'api/query/projectQuery';
import { PlusIcon } from 'components/icons';
import Autocomplete from 'components/shared/Autocomplete';
import Button from 'components/shared/Button';
import { FiltersBar } from 'components/shared/Filters';
import List from 'components/shared/List';
import Page, { PageTitle } from 'components/shared/Page';
import usePageQueries from 'hooks/usePageQueries';
import { IProject } from 'interfaces/project.interface';

import ProjectInfo from './ProjectInfo';
import ProjectModal from './ProjectModal';
import { ProjectsListWrapper } from './styles';

const ProjectListPage = () => {
  const { t } = useTranslation();

  const { data = [], refetch, isFetching } = useGetProjects();
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const navigate = useNavigate();
  const pageQueries = usePageQueries();

  const [projectDialogData, setProjectDialogData] = useState<IProject | boolean>(false);

  useEffect(() => {
    if (!pageQueries.id) {
      setSelectedProject(null);
      return;
    }
    const project = data.find((item) => item._id === pageQueries.id) || null;
    setSelectedProject(project);
  }, [data, pageQueries.id]);

  return (
    <Page title={t('projectList')}>
      <PageTitle>{t('projectList')}</PageTitle>
      <FiltersBar>
        <Autocomplete
          options={data}
          value={selectedProject}
          loading={isFetching}
          label={t('search')}
          labelKey="name"
          style={{ minWidth: 350, maxWidth: 350 }}
          onChange={(value: IProject) => {
            navigate({
              search: value ? createSearchParams({ id: value._id }).toString() : '',
            });
          }}
        />
        <Button onClick={() => void setProjectDialogData(true)} style={{ marginLeft: 'auto' }}>
          <PlusIcon size={20} />{t('project.new')}
        </Button>
      </FiltersBar>
      <ProjectsListWrapper>
        <List<IProject>
          className="projects-list"
          data={data}
          fields={{
            primary: 'name',
          }}
          defaultSelected={selectedProject?._id}
          onSelect={(value) => {
            navigate({
              search: value ? createSearchParams({ id: value._id }).toString() : '',
            });
          }}
        />
        {selectedProject !== null && (
          <ProjectInfo data={selectedProject} onDelete={refetch} key={selectedProject?._id} />
        )}
      </ProjectsListWrapper>
      {!!projectDialogData && (
        <ProjectModal
          onClose={() => { setProjectDialogData(false); refetch(); }}
          open={!!projectDialogData}
          defaultValues={projectDialogData}
        />
      )}
    </Page>
  );
};

export default ProjectListPage;
