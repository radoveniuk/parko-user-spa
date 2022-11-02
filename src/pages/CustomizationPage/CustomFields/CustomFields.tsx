import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import {
  useCreateCustomFormFieldMutation,
  useDeleteCustomFormFieldMutation,
  useUpdateCustomFormFieldMutation,
} from 'api/mutations/customFormsMutation';
import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { fetchTranslation } from 'api/query/translationQuery';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import DialogConfirm from 'components/shared/DialogConfirm';
import Input from 'components/shared/Input';
import List from 'components/shared/List';
import Select from 'components/shared/Select';
import { LANGUAGES } from 'constants/languages';
import useDebounce from 'hooks/useDebounce';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { CustomFormEntity, CustomFormFieldType, ICustomFormField } from 'interfaces/form.interface';

import CustomSections from './CustomSections';
import { CustomFieldsWrapper } from './styles';

const CUSTOM_FIELD_TYPES: CustomFormFieldType[] = ['boolean', 'date', 'number', 'phone', 'string'];

const DEFAULT_CUSTOM_FIELD: Partial<ICustomFormField> = {
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

  const { data: customFields = [], refetch } = useGetCustomFormFields({ entity });
  const createCustomField = useCreateCustomFormFieldMutation();
  const updateCustomField = useUpdateCustomFormFieldMutation();
  const deleteCustomField = useDeleteCustomFormFieldMutation();

  const { register, handleSubmit, reset, formState: { errors }, control, getValues, setValue } = useForm<ICustomFormField>();

  const [activeCustomField, setActiveCustomField] = useState<Partial<ICustomFormField> | null>(null);
  const [customFieldToDelete, setCustomFieldToDelete] = useState<Partial<ICustomFormField> | null>(null);
  const fieldTypeOptions = useTranslatedSelect(CUSTOM_FIELD_TYPES, 'customForms');

  const [nameToTranslate, setNameToTranslate] = useState<{ fromLang: string; text: '' } | null>(null);
  const debouncedNameToTranslate = useDebounce(nameToTranslate, 1500);

  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  useEffect(() => {
    if (projects?.length && activeCustomField) {
      setSelectedProjects(projects?.length ? activeCustomField.projects || [] : []);
    }
  }, [activeCustomField, projects?.length]);

  const submitSaveField: SubmitHandler<ICustomFormField> = (data) => {
    const valuesToSave = {
      ...data,
      projects: selectedProjects,
    };
    if (!data._id) {
      createCustomField.mutateAsync(valuesToSave).then((res) => {
        queryClient.setQueryData(['customFormFields', JSON.stringify({ entity })], [res, ...customFields]);
        setActiveCustomField(null);
        setTimeout(() => {
          setActiveCustomField(res);
        });
      });
    } else {
      updateCustomField.mutateAsync(valuesToSave).then(() => void refetch());
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

  useEffect(() => {
    if (debouncedNameToTranslate?.text.trim()) {
      const names = getValues('names');
      const anotherLangs = Object.keys(names)
        .filter((langCode) => !names[langCode])
        .map((langCode) => langCode !== 'en' ? langCode : `${langCode}-us`);

      const fetchWrapper = async (toLang: string) => {
        const value = await fetchTranslation({ toLang, ...debouncedNameToTranslate });
        return {
          value, code: toLang,
        };
      };

      Promise.all(anotherLangs.map((toLang) => fetchWrapper(toLang)))
        .then((results) => {
          results.forEach((res) => {
            setValue(`names.${res.code.replace('-us', '')}`, res.value);
          });
        });
    }
  }, [debouncedNameToTranslate, getValues, setValue]);

  return (
    <CustomFieldsWrapper>
      <List<ICustomFormField>
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
                {...register(`names.${item.code}`, {
                  required: true,
                  onChange: (e) => {
                    setNameToTranslate({ text: e.target.value, fromLang: item.code });
                  },
                })}
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
          </div>
          <div className="config-wrapper">
            <Select
              multiple
              value={selectedProjects}
              label={t('customForms.projects')}
              options={projects}
              valuePath="_id"
              labelPath="name"
              onChange={(e) => {
                setSelectedProjects(e.target.value as string[]);
              }}
            />
            <Checkbox
              checked={selectedProjects.length === projects.length}
              title={t('selectAll')}
              onChange={(e) => {
                setSelectedProjects(e.target.checked ? projects.map((item) => item._id) : []);
              }}
            />
          </div>
          <div className="config-wrapper">
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
