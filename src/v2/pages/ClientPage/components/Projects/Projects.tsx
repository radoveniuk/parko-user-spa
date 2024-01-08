import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'v2/uikit';
import { FormCard, FormCardBody, FormCardHeader } from 'v2/uikit/FormCard';

import { ProjectIcon } from 'components/icons';
import { IProject } from 'interfaces/project.interface';

import { ProjectsWrapper } from './styles';

type Props = {
  data: IProject[];
};

const Projects = ({ data }: Props) => {
  const { t } = useTranslation();

  const renderProjects = (list: typeof data) => (
    <>
      {list.map((project) => (
        <FormCard key={project._id} className="project-card">
          <FormCardHeader icon={<ProjectIcon />} title={project.name}>
            <Button>{t('edit')}</Button>
          </FormCardHeader>
          <FormCardBody></FormCardBody>
        </FormCard>
      ))}
    </>
  );

  return (
    <ProjectsWrapper>
      {data.length > 1
        ? (
          <>
            <div className="col">
              {renderProjects(data.toSpliced(0, Math.round(data.length / 2)))}
            </div>
            <div className="col">
              {renderProjects(data.toSpliced(Math.round(data.length / 2), data.length))}
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
