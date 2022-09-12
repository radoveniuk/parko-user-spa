/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import List from 'components/shared/List';

import { CustomFieldsWrapper } from './styles';
import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import { CustomFormEntity, CustomFormFieldType, ICustomFormField } from 'interfaces/form.interface';
import { useCreateCustomFormFieldMutation } from 'api/mutations/customFormsMutation';
import Button from 'components/shared/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LANGUAGES } from 'constants/languages';
import Input from 'components/shared/Input';
import Select from 'components/shared/Select';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { useGetProjects } from 'api/query/projectQuery';
import Checkbox from 'components/shared/Checkbox';

const CUSTOM_FIELD_TYPES: CustomFormFieldType[] = ['boolean', 'date', 'email', 'number', 'phone', 'string'];

const DEFAULT_CUSTOM_FIELD: ICustomFormField = {
  entity: 'user',
  names: {
    en: '',
    ru: '',
    uk: '',
    sk: '',
  },
  type: 'string',
  projects: [],
  required: false,
  section: null,
};

type Props = {
  entity: CustomFormEntity
}

const CustomFields = ({
  entity,
}: Props) => {
  const { data = [] } = useGetCustomFormFields({ entity });
  const { data: projects = [] } = useGetProjects();
  const createCustomField = useCreateCustomFormFieldMutation();
  const { i18n, t } = useTranslation();
  const { register, handleSubmit, reset, watch } = useForm<ICustomFormField>();

  const [activeCustomField, setActiveCustomField] = useState<ICustomFormField | null>(null);
  const fieldTypeOptions = useTranslatedSelect(CUSTOM_FIELD_TYPES, 'customForms');

  const submitSaveField: SubmitHandler<ICustomFormField> = (data) => {
    createCustomField.mutate(data);
  };

  useEffect(() => {
    if (activeCustomField !== null) {
      reset(activeCustomField);
    }
  }, [activeCustomField, reset]);

  return (
    <CustomFieldsWrapper>
      <List
        className="custom-fields-list"
        data={data}
        fields={{
          primary: `names.${i18n.language}`,
        }}
        onSelect={(item) => {
          setActiveCustomField(null);
          setTimeout(() => {
            setActiveCustomField(item);
          });
        }}
      />
      {activeCustomField !== null && (
        <form onSubmit={handleSubmit(submitSaveField)} className="update-custom-field-form">
          <span className="form-label">{t('customForms.names')}</span>
          <div className="config-wrapper">
            {LANGUAGES.map((item) => (
              <Input
                key={item.code}
                label={`${item.code} - ${item.title}`}
                {...register(`names.${item.code}`)}
              />
            ))}
          </div>
          <span className="form-label">{t('customForms.configuration')}</span>
          <div className="config-wrapper">
            <Select
              options={fieldTypeOptions}
              label={t('customForms.type')}
              defaultValue={activeCustomField.type || ''}
              {...register('type')}
            />
            <Select
              defaultValue={projects?.length ? activeCustomField.projects || '' : ''}
              multiple
              label={t('customForms.projects')}
              options={projects}
              valuePath="_id"
              labelPath="name"
              {...register('projects')}
            />
            <Checkbox defaultChecked={activeCustomField.required} title={t('customForms.required')} {...register('required')} />
          </div>
          <span className="form-label">{t('customForms.sections')}</span>
          <div className="config-wrapper">

          </div>
          <div className="config-wrapper">
            <Button type="submit">{t('customForms.save')}</Button>
            <Button color="error" variant="outlined" type="button">{t('customForms.delete')}</Button>
          </div>
        </form>
      )}
      <Button
        color="secondary"
        className="create-custom-field-button"
        onClick={() => void setActiveCustomField({ ...DEFAULT_CUSTOM_FIELD, entity })}
      >+</Button>
    </CustomFieldsWrapper>
  );
};

export default CustomFields;
