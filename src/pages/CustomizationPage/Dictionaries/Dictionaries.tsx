import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from 'v2/uikit/Button';
import Chip from 'v2/uikit/Chip';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import Input from 'v2/uikit/Input';

import { useCreateDictionaryMutation, useDeleteDictionaryMutation, useUpdateDictionaryMutation } from 'api/mutations/dictionaryMutation';
import { useGetDictionaries } from 'api/query/dictionariesQuery';
import { PlusIcon } from 'components/icons';
import List from 'components/shared/List';
import { IDictionary } from 'interfaces/dictionary.interface';

import { DictionariesWrapper } from './styles';

const DEFAULT_FORM_VALUES: Partial<IDictionary> = {
  name: '',
  options: [],
  disabled: false,
};

const Dictionaries = () => {
  const { t } = useTranslation();

  const { data: dictionaries = [], refetch } = useGetDictionaries();
  const createDictionary = useCreateDictionaryMutation();
  const updateDictionary = useUpdateDictionaryMutation();
  const deleteDictionary = useDeleteDictionaryMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IDictionary>();

  const [activeDictionary, setActiveDictionary] = useState<Partial<IDictionary> | null>(null);
  const [dictionaryToDelete, setDictionaryToDelete] = useState<Partial<IDictionary> | null>(null);

  const [dictionaryOptions, setDictionaryOptions] = useState<string[] | null>(null);
  const [optionText, setOptionText] = useState('');

  const addOption = () => {
    if (!optionText) return;
    setDictionaryOptions((prev) => {
      const dictionarySet = new Set(prev || []);
      dictionarySet.add(optionText);
      return [...Array.from(dictionarySet)];
    });
    setOptionText('');
  };

  const removeOption = (option: string) => {
    setDictionaryOptions((prev) => prev?.filter((filterOption) => filterOption !== option) || null);
    setOptionText('');
  };

  const submitSave: SubmitHandler<IDictionary> = (values) => {
    const data: IDictionary = { ...values, options: dictionaryOptions || [] };
    if (!data._id) {
      createDictionary.mutateAsync(data)
        .then((res) => {
          refetch();
          if (res._id) {
            setActiveDictionary(res);
          }
        });
    } else {
      updateDictionary.mutateAsync(data)
        .then(() => void refetch());
    }
  };

  const submitDelete = () => {
    if (!dictionaryToDelete?._id) return;
    deleteDictionary.mutateAsync(dictionaryToDelete._id).then(() => {
      refetch();
      setActiveDictionary(null);
      setDictionaryToDelete(null);
      setDictionaryOptions(null);
    });
  };

  useEffect(() => {
    if (activeDictionary !== null) {
      reset(activeDictionary);
    }
  }, [activeDictionary, reset]);

  return (
    <DictionariesWrapper>
      <List<IDictionary>
        className="dictionaries-list"
        data={dictionaries}
        fields={{
          primary: (row) => row.label ? t(row.label) : row.name,
        }}
        onSelect={(item) => {
          setActiveDictionary(null);
          setTimeout(() => {
            setActiveDictionary(item);
            setDictionaryOptions(item.options);
          });
        }}
        defaultSelected={activeDictionary?._id}
      />
      {activeDictionary !== null && (
        <div className="form">
          <Input
            label={t('dictionary.name')}
            error={!!errors.name}
            InputLabelProps={{ shrink: true }}
            disabled={activeDictionary.disabled}
            {...register('name', {
              required: true,
            })}
          />
          <Input
            label={t('dictionary.addOption')}
            value={optionText}
            onChange={(e) => void setOptionText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addOption();
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={addOption}><PlusIcon /></IconButton>
              ),
            }}
          />
          <div className="chips-wrapper">
            {dictionaryOptions?.map((option) => (
              <Chip
                key={option}
                label={option}
                onDelete={() => void removeOption(option)}
              />
            ))}
          </div>
          <div className="config-wrapper">
            <Button type="button" onClick={handleSubmit(submitSave)}>{t('customForms.save')}</Button>
            {!!activeDictionary._id && !activeDictionary.disabled && (
              <Button
                color="error"
                variant="outlined"
                type="button"
                onClick={() => void setDictionaryToDelete(activeDictionary)}
              >
                {t('customForms.delete')}
              </Button>
            )}
          </div>
        </div>
      )}
      <Button
        className="create-fab"
        onClick={() => {
          setActiveDictionary(DEFAULT_FORM_VALUES);
          setDictionaryOptions(null);
        }}
      >+</Button>
      {dictionaryToDelete !== null && (
        <DialogConfirm open={!!dictionaryToDelete} onClose={() => void setDictionaryToDelete(null)} onSubmit={submitDelete} />
      )}
    </DictionariesWrapper>
  );
};

export default Dictionaries;
