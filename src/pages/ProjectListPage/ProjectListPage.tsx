import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import Autocomplete from 'v2/uikit/Autocomplete';
import Select from 'v2/uikit/Select';

import { useGetProjects } from 'api/query/projectQuery';
import { PlusIcon } from 'components/icons';
import Button from 'components/shared/Button';
import { FiltersBar } from 'components/shared/Filters';
import List from 'components/shared/List';
import { PROJECT_STATUS } from 'constants/selectsOptions';
import usePageQueries from 'hooks/usePageQueries';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IProject } from 'interfaces/project.interface';

import ProjectInfo from './ProjectInfo';
import ProjectModal from './ProjectModal';
import { ProjectsListWrapper } from './styles';

const ProjectListPage = () => {
  const { t } = useTranslation();

  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const navigate = useNavigate();
  const pageQueries = usePageQueries();

  // filter
  const statuses = useTranslatedSelect(PROJECT_STATUS, 'projectStatus');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { data = [], refetch, isFetching } = useGetProjects();
  const projectListData = useMemo(() => {
    if (statusFilter !== null) {
      return data.filter((client) => client.status === statusFilter);
    }
    return data;
  }, [data, statusFilter]);
  useEffect(() => {
    if (selectedProject && !projectListData.some((item) => item._id === selectedProject._id)) {
      navigate({ search: '' });
    }
  }, [navigate, projectListData, selectedProject]);

  const [projectDialogData, setProjectDialogData] = useState<IProject | boolean>(false);

  const selectProject = (value: IProject) => {
    navigate({
      search: value ? createSearchParams({ id: value._id }).toString() : '',
    });
  };

  useEffect(() => {
    if (!pageQueries.id) {
      setSelectedProject(null);
      return;
    }
    const project = data.find((item) => item._id === pageQueries.id) || null;
    setSelectedProject(project);
  }, [data, pageQueries.id]);

  useDocumentTitle(t('projectList'));

  return (
    <>
      <FiltersBar>
        <Autocomplete
          options={projectListData}
          value={selectedProject}
          loading={isFetching}
          label={t('search')}
          labelKey="name"
          style={{ minWidth: 350, maxWidth: 350 }}
          onChange={selectProject}
        />
        <Select
          options={statuses}
          emptyItem={t('selectAll')}
          label={t('project.status')}
          onChange={(e) => void setStatusFilter(e.target.value as string || null)}
        />
        <Button onClick={() => void setProjectDialogData(true)} style={{ marginLeft: 'auto' }}>
          <PlusIcon size={20} />{t('project.creating')}
        </Button>
      </FiltersBar>
      <ProjectsListWrapper>
        <List<IProject>
          className="projects-list"
          data={projectListData}
          fields={{
            primary: 'name',
          }}
          defaultSelected={selectedProject?._id}
          onSelect={(value) => void selectProject(value)}
        />
        {selectedProject !== null && (
          <ProjectInfo data={selectedProject} onDelete={refetch} key={selectedProject?._id} />
        )}
      </ProjectsListWrapper>
      {!!projectDialogData && (
        <ProjectModal
          onClose={() => { setProjectDialogData(false); refetch(); }}
          open={!!projectDialogData}
        />
      )}
    </>
  );
};

export default ProjectListPage;
