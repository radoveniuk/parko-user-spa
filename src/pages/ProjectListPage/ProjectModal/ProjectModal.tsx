import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash-es';

import { useCreateProjectMutation } from 'api/mutations/projectMutation';
import Button from 'components/shared/Button';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import { IProject } from 'interfaces/project.interface';

import ProjectForm from '../ProjectForm';

import { DialogActionsWrapper } from './styles';

const ProjectModal = ({ onClose, ...rest }: DialogProps) => {
  const { t } = useTranslation();
  const createProjectMutation = useCreateProjectMutation();

  const methods = useForm<IProject>();

  const submitHandler: SubmitHandler<IProject> = async (data) => {
    createProjectMutation.mutateAsync(data).then(() => {
      onClose();
    });
  };

  return (
    <Dialog title={t('project.creating')} onClose={onClose} {...rest}>
      <FormProvider {...methods}>
        <ProjectForm />
      </FormProvider>
      <DialogActionsWrapper>
        <Button onClick={methods.handleSubmit(submitHandler)} disabled={!isEmpty(methods.formState.errors)}>{t('project.submit')}</Button>
      </DialogActionsWrapper>
    </Dialog>
  );
};

export default ProjectModal;
