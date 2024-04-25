import React from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

import { useDeleteProjectMutation, useUpdateProjectMutation } from 'api/mutations/projectMutation';
import { useAuthData } from 'contexts/AuthContext';
import { IProject } from 'interfaces/project.interface';

import ProjectFormCard from './ProjectFormCard';
import { ProjectsWrapper } from './styles';

type Props = {
  data: IProject[];
};

const Projects = ({ data }: Props) => {
  const { id: clientId } = useParams();
  const updateProjectMutation = useUpdateProjectMutation();
  const deleteProjectMutation = useDeleteProjectMutation();
  const queryClient = useQueryClient();

  const renderProjects = (list: typeof data) => list.map((project) => (
    <ProjectFormCard
      key={project._id}
      data={project}
      onChange={(values) => {
        updateProjectMutation.mutate({ ...project, ...values });
      }}
      onDelete={() => {
        deleteProjectMutation.mutate(project._id);
        queryClient.setQueryData(
          ['projects', JSON.stringify({ client: clientId })],
          data.filter((projectToDelete) => projectToDelete._id !== project._id),
        );
      }}
    />
  ));

  const { permissions } = useAuthData();

  if (!permissions.includes('projects:read')) return null;

  return (
    <ProjectsWrapper>
      {data.length > 1
        ? (
          <>
            <div className="col">
              {renderProjects(data.toSpliced(Math.round(data.length / 2), data.length))}
            </div>
            <div className="col">
              {renderProjects(data.toSpliced(0, Math.round(data.length / 2)))}
            </div>
          </>
        )
        : (
          <div className="col">
            {renderProjects(data)}
          </div>
        )}
    </ProjectsWrapper>
  );
};

export default Projects;
