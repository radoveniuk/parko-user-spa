import React, { memo, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash-es/isEmpty';
import Button from 'v2/uikit/Button';
import Chip from 'v2/uikit/Chip';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Input from 'v2/uikit/Input';
import Select from 'v2/uikit/Select';

import { fetchTranslation } from 'api/query/translationQuery';
import { AcceptIcon, PlusIcon } from 'components/icons';
import { LANGUAGES } from 'constants/languages';
import useDebounce from 'hooks/useDebounce';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { CustomFormFieldType, ICustomFormField } from 'interfaces/form.interface';

import useCustomFormFieldActions from '../hooks/useCustomFormFieldActions';

import { AddOptionButton, DialogContentWrapper, OptionField, OptionFieldWrapper } from './styles';

type Props = DialogProps & {
  defaultData: ICustomFormField | true;
};

const CUSTOM_FIELD_TYPES: CustomFormFieldType[] = ['boolean', 'date', 'number', 'phone', 'string', 'select', 'multiselect', 'expirience', 'textarea'];

const FieldDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  const {
    register, formState: { errors }, handleSubmit, getValues, setValue, watch, control,
  } = useForm<ICustomFormField>({ defaultValues: typeof defaultData !== 'boolean' ? defaultData : {} });
  const fieldTypeOptions = useTranslatedSelect(CUSTOM_FIELD_TYPES, 'customForms');

  // translate names to 3 langs
  const [nameToTranslate, setNameToTranslate] = useState<{ fromLang: string; text: '' } | null>(null);
  const debouncedNameToTranslate = useDebounce(nameToTranslate, 1500);

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

  // form submit
  const { create, update } = useCustomFormFieldActions();

  const submitHandler: SubmitHandler<ICustomFormField> = (values) => {
    defaultData === true ? create(values) : update(values);
    onClose();
  };

  // create of new option
  const [showNewOptionField, setShowNewOptionField] = useState(false);
  const [newOptionLabel, setNewOptionLabel] = useState('');

  return (
    <Dialog
      onClose={onClose}
      mobileFullscreen
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          {LANGUAGES.map((item) => (
            <Input
              key={item.code}
              label={`${t('customForms.names')} (${item.code})`}
              InputLabelProps={{ shrink: true }}
              error={!!errors.names?.[item.code]}
              allowCyrillic
              theme="gray"
              {...register(`names.${item.code}`, {
                required: true,
                onChange: (e) => {
                  setNameToTranslate({ text: e.target.value, fromLang: item.code });
                },
              })}
            />
          ))}
          <div className="fullwidth">
            <Select
              options={fieldTypeOptions}
              label={t('customForms.fieldType')}
              defaultValue={typeof defaultData !== 'boolean' ? defaultData.type || '' : ''}
              theme="gray"

              {...register('type')}
            />
          </div>
          {(watch('type') === 'select' || watch('type') === 'multiselect') && (
            <div className="customSelectOptions fullwidth">
              <div className="label">{t('customForms.addOptions')}:</div>
              <Controller
                control={control}
                name="options"
                render={({ field }) => (
                  <div className="options">
                    {field.value?.map((option) => (
                      <Chip
                        key={option}
                        label={t(option)}
                        onDelete={() => {
                          field.onChange(field.value.filter((item) => item !== option));
                        }}
                      />
                    ))}
                    {!showNewOptionField && (
                      <AddOptionButton onClick={() => void setShowNewOptionField(true)}><PlusIcon size={20} /></AddOptionButton>
                    )}
                    {showNewOptionField && (
                      <OptionFieldWrapper>
                        <OptionField onChange={(e) => void setNewOptionLabel(e.target.value)} value={newOptionLabel} />
                        <AddOptionButton
                          onClick={() => {
                            if (newOptionLabel && !field.value?.includes(newOptionLabel)) {
                              field.onChange([...(field.value || []), newOptionLabel]);
                              setNewOptionLabel('');
                              setShowNewOptionField(false);
                            } else {
                              setNewOptionLabel('');
                              setShowNewOptionField(false);
                            }
                          }}
                        >
                          <AcceptIcon size={20} />
                        </AddOptionButton>
                      </OptionFieldWrapper>
                    )}
                  </div>
                )}
              />
            </div>
          )}
        </div>
      </DialogContentWrapper>
      <DialogActions>
        <Button
          onClick={handleSubmit(submitHandler)}
          disabled={!isEmpty(errors)}
          variant="contained"
        >
          {t('approve')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(FieldDialog);
