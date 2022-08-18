import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { isEmpty } from 'lodash-es';

import Page, { PageTitle } from 'components/shared/Page';
import { IProject } from 'interfaces/project.interface';
import usePageQueries from 'hooks/usePageQueries';
import { useGetProject } from 'api/query/projectQuery';
import Input from 'components/shared/Input';
import DatePicker from 'components/shared/DatePicker';
import Button from 'components/shared/Button';
import { useCreateProjectMutation, useUpdateProjectMutation } from 'api/mutations/projectMutation';
import Select from 'components/shared/Select';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { PROJECT_TARIFF_TYPE } from 'constants/selectsOptions';
import PhoneInput, { checkPhoneNumber } from 'components/shared/PhoneInput';

import { ProjectFormWrapper } from './styles';
import { validateEmail } from 'helpers/validateEmail';

const ProjectPage = () => {
  const { t } = useTranslation();
  const { id } = usePageQueries();
  const { data: projectData } = useGetProject(id);
  const createProjectMutation = useCreateProjectMutation();
  const updateProjectMutation = useUpdateProjectMutation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const tariffTypes = useTranslatedSelect(PROJECT_TARIFF_TYPE, 'tariff');

  const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm<IProject>();

  const submitHandler: SubmitHandler<IProject> = async (data) => {
    const mutation = id ? updateProjectMutation : createProjectMutation;
    mutation.mutateAsync(data).then(() => {
      enqueueSnackbar(t('project.success'), { variant: 'success' });
      setTimeout(() => {
        navigate('/projects');
      }, 1000);
    });
  };

  useEffect(() => {
    if (projectData) {
      reset(projectData);
    }
  }, [reset, projectData]);

  return (
    <Page title={t('project.creating')}>
      <PageTitle>{watch('name') || t('project.creating')}</PageTitle>
      {((!!id && !!projectData) || (!id)) && (
        <ProjectFormWrapper>
          <div className="inputs">
            <Input
              label={t('project.name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name', { required: true })}
            />
            <Input
              label={t('project.email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', { validate: (v) => !v || validateEmail(v) })}
            />
            <Controller
              control={control}
              name="phone"
              defaultValue=""
              rules={{ validate: (value) => !value || checkPhoneNumber(value) }}
              render={({ field }) => (
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  label={t('project.phone')}
                  error={!!errors.phone}
                />
              )}
            />
            <Input
              label={t('project.comment')}
              error={!!errors.comment}
              helperText={errors.comment?.message}
              multiline
              {...register('comment')}
            />
            <Input
              label={t('project.cost')}
              error={!!errors.cost}
              helperText={errors.cost?.message}
              type="number"
              {...register('cost')}
            />
            <Select
              label={t('project.tariff')}
              error={!!errors.tariff}
              options={tariffTypes}
              className="inputs-select"
              {...register('tariff')}
            />
            <Controller
              control={control}
              name="dateStart"
              defaultValue={null}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  label={t('project.dateStart')}
                />
              )}
            />
            <Controller
              control={control}
              name="dateEnd"
              defaultValue={null}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  label={t('project.dateEnd')}
                />
              )}
            />
          </div>
          <Button className="submit-button" onClick={handleSubmit(submitHandler)} disabled={!isEmpty(errors)}>{t('project.submit')}</Button>
        </ProjectFormWrapper>
      )}
    </Page>
  );
};

export default ProjectPage;
