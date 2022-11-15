import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash-es';

import { useCreateProjectMutation, useUpdateProjectMutation } from 'api/mutations/projectMutation';
import { useGetCustomFormFields, useGetCustomFormSections } from 'api/query/customFormsQuery';
import CustomField from 'components/complex/CustomField';
import Accordion, { AccordionContent } from 'components/shared/Accordion';
import Button from 'components/shared/Button';
import DatePicker from 'components/shared/DatePicker';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import Input from 'components/shared/Input';
import PhoneInput, { checkPhoneNumber } from 'components/shared/PhoneInput';
import Select from 'components/shared/Select';
import { PROJECT_TARIFF_TYPE } from 'constants/selectsOptions';
import { validateEmail } from 'helpers/validateEmail';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IProject } from 'interfaces/project.interface';

import { DialogActionsWrapper, ProjectFormWrapper } from './styles';

type Props = DialogProps & {
  defaultValues: true | IProject;
}

const ProjectModal = ({ defaultValues, onClose, ...rest }: Props) => {
  const { t, i18n } = useTranslation();
  const createProjectMutation = useCreateProjectMutation();
  const updateProjectMutation = useUpdateProjectMutation();
  const tariffTypes = useTranslatedSelect(PROJECT_TARIFF_TYPE, 'tariff');

  // custom fields
  const { data: customSections = [] } = useGetCustomFormSections({ entity: 'project' }, { enabled: defaultValues !== true });
  const { data: customFields = [] } = useGetCustomFormFields({
    entity: 'project',
    projects: [(defaultValues as IProject)?._id],
  }, { enabled: defaultValues !== true });

  const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm<IProject>();

  const submitHandler: SubmitHandler<IProject> = async (data) => {
    const mutation = defaultValues !== true ? updateProjectMutation : createProjectMutation;
    mutation.mutateAsync(data).then(() => {
      onClose();
    });
  };

  useEffect(() => {
    if (defaultValues !== true) {
      reset(defaultValues);
    }
  }, [reset, defaultValues]);

  return (
    <Dialog title={watch('name') || t('project.creating')} onClose={onClose} {...rest}>
      <ProjectFormWrapper>
        <Accordion
          title={t('project.mainInfo')}
          id="main-props"
          className="accordion"
          defaultExpanded
        >
          <AccordionContent>
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
              defaultValue={(defaultValues as IProject)?.tariff || ''}
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
          </AccordionContent>
        </Accordion>
        {customSections
          .filter((section) => customFields.some((customField) => customField.section === section._id))
          .map((section) => (
            <Accordion
              key={section._id}
              title={section.names[i18n.language]}
              id={section._id}
              className="accordion"
            >
              <AccordionContent>
                {customFields
                  .filter((customField) => customField.section === section._id)
                  .map((customField) => (
                    <Controller
                      key={customField._id}
                      name={`customFields.${customField._id}`}
                      rules={{ required: customField.required }}
                      control={control}
                      defaultValue={(defaultValues as IProject)?.customFields?.[customField._id as string] || ''}
                      render={({ field }) => (
                        <div className="field-wrap">
                          <CustomField
                            value={field.value}
                            onChange={field.onChange}
                            metadata={customField}
                          />
                        </div>
                      )}
                    />
                  ))}
              </AccordionContent>
            </Accordion>
          ))}
      </ProjectFormWrapper>
      <DialogActionsWrapper>
        <Button onClick={handleSubmit(submitHandler)} disabled={!isEmpty(errors)}>{t('project.submit')}</Button>
      </DialogActionsWrapper>
    </Dialog>
  );
};

export default ProjectModal;
