import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';

import List from 'components/shared/List';

import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import {
  useCreateCustomFormFieldMutation,
  useDeleteCustomFormFieldMutation,
  useUpdateCustomFormFieldMutation,
} from 'api/mutations/customFormsMutation';
import { CustomFormEntity, CustomFormFieldType, ICustomFormField } from 'interfaces/form.interface';
import Button from 'components/shared/Button';
import { LANGUAGES } from 'constants/languages';
import Input from 'components/shared/Input';
import Select from 'components/shared/Select';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { useGetProjects } from 'api/query/projectQuery';
import Checkbox from 'components/shared/Checkbox';
import DialogConfirm from 'components/shared/DialogConfirm';

import CustomSections from './CustomSections';

import { CustomFieldsWrapper } from './styles';

const CUSTOM_FIELD_TYPES: CustomFormFieldType[] = ['boolean', 'date', 'number', 'phone', 'string'];

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
  const { i18n, t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: projects = [] } = useGetProjects();

  const { data: customFields = [] } = useGetCustomFormFields({ entity });
  const createCustomField = useCreateCustomFormFieldMutation();
  const updateCustomField = useUpdateCustomFormFieldMutation();
  const deleteCustomField = useDeleteCustomFormFieldMutation();

  const { register, handleSubmit, reset, formState: { errors }, control } = useForm<ICustomFormField>();

  const [activeCustomField, setActiveCustomField] = useState<ICustomFormField | null>(null);
  const [customFieldToDelete, setCustomFieldToDelete] = useState<ICustomFormField | null>(null);
  const fieldTypeOptions = useTranslatedSelect(CUSTOM_FIELD_TYPES, 'customForms');

  const submitSaveField: SubmitHandler<ICustomFormField> = (data) => {
    if (!data._id) {
      createCustomField.mutateAsync(data).then((res) => {
        queryClient.setQueryData(['customFormFields', JSON.stringify({ entity })], [...customFields, res]);
      });
    } else {
      updateCustomField.mutate(data);
    }
  };

  const submitDeleteField = () => {
    if (!customFieldToDelete?._id) return;
    deleteCustomField.mutateAsync(customFieldToDelete._id).then(() => {
      queryClient.setQueryData(['customFormFields', JSON.stringify({ entity })], customFields.filter((item) => item._id !== customFieldToDelete._id));
      setActiveCustomField(null);
      setCustomFieldToDelete(null);
    });
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
        data={customFields}
        fields={{
          primary: `names.${i18n.language}`,
        }}
        onSelect={(item) => {
          setActiveCustomField(null);
          setTimeout(() => {
            setActiveCustomField(item);
          });
        }}
        defaultSelected={activeCustomField?._id}
      />
      {activeCustomField !== null && (
        <form onSubmit={handleSubmit(submitSaveField)} className="update-custom-field-form">
          <span className="form-label">{t('customForms.names')}</span>
          <div className="config-wrapper">
            {LANGUAGES.map((item) => (
              <Input
                key={item.code}
                label={`${item.code} - ${item.title}`}
                InputLabelProps={{ shrink: true }}
                error={!!errors.names?.[item.code]}
                {...register(`names.${item.code}`, { required: true })}
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
          <Controller
            control={control}
            name="section"
            defaultValue={activeCustomField.section}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSections value={field.value} onChange={field.onChange} entity={entity} />
            )}
          />
          <div className="config-wrapper">
            <Button type="submit">{t('customForms.save')}</Button>
            {!!activeCustomField._id && (
              <Button
                color="error"
                variant="outlined"
                type="button"
                onClick={() => void setCustomFieldToDelete(activeCustomField)}
              >{t('customForms.delete')}</Button>
            )}
          </div>
        </form>
      )}
      <Button
        color="secondary"
        className="create-custom-field-button"
        onClick={() => {
          setActiveCustomField(null);
          setTimeout(() => {
            setActiveCustomField({ ...DEFAULT_CUSTOM_FIELD, entity });
          });
        }}
      >+</Button>
      {customFieldToDelete !== null && (
        <DialogConfirm open={!!customFieldToDelete} onClose={() => void setCustomFieldToDelete(null)} onSubmit={submitDeleteField} />
      )}
    </CustomFieldsWrapper>
  );
};

export default CustomFields;
