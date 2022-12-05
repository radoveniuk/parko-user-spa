import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useGetCustomFormFields, useGetCustomFormSections } from 'api/query/customFormsQuery';
import CustomField from 'components/complex/CustomField';
import Accordion, { AccordionContent } from 'components/shared/Accordion';
import DatePicker from 'components/shared/DatePicker';
import Input from 'components/shared/Input';
import PhoneInput, { checkPhoneNumber } from 'components/shared/PhoneInput';
import Select from 'components/shared/Select';
import { PROJECT_TARIFF_TYPE } from 'constants/selectsOptions';
import { validateEmail } from 'helpers/validateEmail';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IProject } from 'interfaces/project.interface';

import ProjectStages from '../ProjectStages';

import { ProjectFormWrapper } from './styles';

type Props = {
  defaultValues?: IProject;
}

const ProjectForm = ({ defaultValues }: Props) => {
  const { t, i18n } = useTranslation();
  const tariffTypes = useTranslatedSelect(PROJECT_TARIFF_TYPE, 'tariff');

  // custom fields
  const { data: customSections = [] } = useGetCustomFormSections({ entity: 'project' }, { enabled: !!defaultValues });
  const { data: customFields = [] } = useGetCustomFormFields({
    entity: 'project',
    projects: [(defaultValues as IProject)?._id],
  }, { enabled: !!defaultValues });

  const { register, formState: { errors }, control } = useFormContext<IProject>();

  return (
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
            label={t('project.status')}
            {...register('status')}
          />
          <Input
            label={t('project.location')}
            {...register('location')}
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
      <Accordion title={t('project.stages')} defaultExpanded>
        <AccordionContent>
          <Controller
            control={control}
            name="stages"
            defaultValue={[]}
            render={({ field }) => (
              <ProjectStages onChange={field.onChange} defaultValue={field.value} />
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
  );
};

export default ProjectForm;
