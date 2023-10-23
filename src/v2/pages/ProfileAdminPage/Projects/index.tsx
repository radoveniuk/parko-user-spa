import React, { memo } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import IconButton from 'v2/uikit/IconButton';

import { useGetDictionary } from 'api/query/dictionariesQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUser } from 'api/query/userQuery';
import { EditIcon, InfoIcon } from 'components/icons';
import DatePicker from 'components/shared/DatePicker';
import Select from 'components/shared/Select';
import Stepper from 'components/shared/Stepper';
import { EMPLOYMENT_TYPE } from 'constants/selectsOptions';
import { USER_STATUSES } from 'constants/statuses';
import { SYSTEM_SETTINGS_FIELDS, WORK_FIELDS } from 'constants/userFormFields';
import { getDateFromIso } from 'helpers/datetime';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { AnyObject } from 'interfaces/base.types';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { ProjectWrapper } from './styles';

// TODO any
interface ProjectsProps {
    methods: UseFormReturn<IUser, any>
    setStages: any
    setProjectStages: any
    projectStages: string[]
    setOpenStages: any
    stages: any
    activeStage: any
}

const Projects = ({ setStages, setProjectStages, methods, projectStages, setOpenStages, stages, activeStage }: ProjectsProps) => {
  const { t } = useTranslation();
  const { data: projects = [] } = useGetProjects();
  const { id: userId } = useParams();
  const { data: profileData } = useGetUser(userId as string);
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');
  const translatedEmploymentTypes = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType', true, false);
  const { data: cooperationTypeDictionary } = useGetDictionary('PROFILE_COOPERATION_TYPES');
  const { data: profilePositionDictionary } = useGetDictionary('PROFILE_POSITIONS');

  if (!profileData) return null;

  return (
    <ProjectWrapper>
      <div className="card-title">
        {!!projects.length && profileData && (
          <Select
            options={projects}
            defaultValue={(profileData.project as IProject)?._id || ''}
            label={t('user.project')}
            valuePath="_id"
            emptyItem="noSelected"
            labelPath={(row) => {
              const project = row as IProject;
              const client = project.client as IClient | null;
              return `${project.name} ${client ? `(${t('project.client')} - ${client.name})` : ''}`;
            }}
            {...methods.register('project', {
              onChange (e) {
                const project = projects.find((item) => item._id === e.target.value);
                const stagesObject: AnyObject = {};
                project?.stages?.forEach((stageName) => {
                  stagesObject[stageName] = {
                    active: false,
                    date: '',
                    comment: '',
                  };
                });
                setStages(stagesObject);
                setProjectStages(project?.stages || []);
              },
            })}
          />
        )}
      </div>
      <div className="select_blocks">
        <Select
          options={translatedStatuses}
          defaultValue={profileData.status || ''}
          label={t('user.status')}
          {...methods.register('status')}
          {...SYSTEM_SETTINGS_FIELDS.status?.selectProps}
        />
        <Select
          options={translatedEmploymentTypes}
          defaultValue={profileData.employmentType || ''}
          label={t('user.employmentType')}
          {...methods.register('employmentType', {
            required: methods.watch('status') === 'hired',
          })}
          error={!!methods.formState.errors.employmentType}
          {...WORK_FIELDS.cooperationType?.selectProps}
        />
        <Select
          options={cooperationTypeDictionary?.options || []}
          defaultValue={profileData.cooperationType || ''}
          label={t('user.cooperationType')}
          {...methods.register('cooperationType')}
          {...WORK_FIELDS.cooperationType?.selectProps}
        />
        <Select
          options={profilePositionDictionary?.options || []}
          defaultValue={profileData.position || ''}
          label={t('user.position')}
          {...methods.register('position', {
            required: methods.watch('status') === 'hired',
          })}
          error={!!methods.formState.errors.position}
          {...WORK_FIELDS.position?.selectProps}
        />
        <Controller
          control={methods.control}
          name="cooperationStartDate"
          defaultValue={profileData.cooperationStartDate}
          rules={{
            required: methods.watch('status') === 'hired',
          }}
          render={({ field }) => (
            <DatePicker
              value={field.value as string}
              onChange={field.onChange}
              label={t('user.cooperationStartDate')}
              error={!!methods.formState.errors.cooperationStartDate}
            />
          )}
        />
        <Controller
          control={methods.control}
          name="cooperationEndDate"
          defaultValue={profileData.cooperationEndDate}
          rules={{
            required: methods.watch('status') === 'fired',
          }}
          render={({ field }) => (
            <DatePicker
              value={field.value as string}
              onChange={field.onChange}
              label={t('user.cooperationEndDate')}
              error={!!methods.formState.errors.cooperationEndDate}
            />
          )}
        />
      </div>
      <div className="card-title card-title-projects">
        {t('project.stages')}
        <IconButton onClick={() => void setOpenStages(true)} disabled={!projectStages?.length}><EditIcon /></IconButton>
      </div>
      <div className="project-stages">
        <Stepper
          orientation="vertical"
          steps={projectStages}
          activeStep={projectStages.indexOf(activeStage as string)}
          getStepComponent={step => (
            <div className="stage-step">
              <div className="stage-label">
                <div>{step}</div>
                <div className="date">{getDateFromIso(stages?.[step].date)}</div>
              </div>
              {!!stages?.[step].comment && (
                <IconButton
                  className="stage-info-icon"
                  title={stages?.[step].comment}
                >
                  <InfoIcon />
                </IconButton>
              )}
            </div>
          )}
        />
      </div>
    </ProjectWrapper>
  );
};

export default memo(Projects);
