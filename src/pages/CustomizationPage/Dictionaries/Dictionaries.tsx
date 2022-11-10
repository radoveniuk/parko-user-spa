import React, { useState } from 'react';

// import { useTranslation } from 'react-i18next';
import { useGetDictionaries } from 'api/query/dictionariesQuery';
import Button from 'components/shared/Button';
import List from 'components/shared/List';
import { IDictionary } from 'interfaces/dictionary.interface';

import { DictionariesWrapper } from './styles';

const Dictionaries = () => {
  // const { i18n } = useTranslation();

  const { data: customFields = [] } = useGetDictionaries();
  // const createCustomField = useCreateCustomFormFieldMutation();
  // const updateCustomField = useUpdateCustomFormFieldMutation();
  // const deleteCustomField = useDeleteCustomFormFieldMutation();

  // const { register, handleSubmit, reset, formState: { errors }, control, getValues, setValue } = useForm<IDictionary>();

  const [activeDictionary, setActiveDictionary] = useState<Partial<IDictionary> | null>(null);
  // const [dictionaryToDelete, setDictionaryToDelete] = useState<Partial<IDictionary> | null>(null);

  // const submitSaveField: SubmitHandler<IDictionary> = (data) => {
  //   console.log(data);

  //   if (!data._id) {
  //     // TODO create
  //   } else {
  //     // TODO update
  //   }
  // };

  // useEffect(() => {
  //   if (activeCustomField !== null) {
  //     reset(activeCustomField);
  //   }
  // }, [activeCustomField, reset]);

  return (
    <DictionariesWrapper>
      <List<IDictionary>
        className="custom-fields-list"
        data={customFields}
        fields={{
          primary: 'name',
        }}
        onSelect={(item) => {
          setActiveDictionary(null);
          setTimeout(() => {
            setActiveDictionary(item);
          });
        }}
        defaultSelected={activeDictionary?._id}
      />
      {/* {activeCustomField !== null && (
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
      )} */}
      <Button
        className="create-custom-field-button"
        onClick={() => {
          setActiveDictionary(null);
        }}
      >+</Button>
    </DictionariesWrapper>
  );
};

export default Dictionaries;
