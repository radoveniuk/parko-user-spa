import React from 'react';

import { useUpdateProjectMutation } from 'api/mutations/projectMutation';
import { IProject } from 'interfaces/project.interface';

import ProjectFormCard from './ProjectFormCard';
import { ProjectsWrapper } from './styles';

type Props = {
  data: IProject[];
};

const Projects = ({ data }: Props) => {
  const updateProjectMutation = useUpdateProjectMutation();

  const renderProjects = (list: typeof data) => list.map((project) => (
    <ProjectFormCard
      key={project._id}
      data={project}
      onChange={(values) => {
        updateProjectMutation.mutate({ ...project, ...values });
      }}
    />
  ));

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
