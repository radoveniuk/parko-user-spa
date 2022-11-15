import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import {
  useCreateCustomFormSectionMutation,
  useDeleteCustomFormSectionMutation,
  useUpdateCustomFormSectionMutation,
} from 'api/mutations/customFormsMutation';
import { useGetCustomFormSections } from 'api/query/customFormsQuery';
import { fetchTranslation } from 'api/query/translationQuery';
import { DeleteIcon, EditIcon, PlusIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import DialogConfirm from 'components/shared/DialogConfirm';
import IconButton from 'components/shared/IconButton';
import Input from 'components/shared/Input';
import RadioButtonGroup, { RadioButton } from 'components/shared/RadioButtonGroup';
import { LANGUAGES } from 'constants/languages';
import useDebounce from 'hooks/useDebounce';
import { CustomFormEntity, ICustomFormSection } from 'interfaces/form.interface';

import { CustomSectionForm, CustomSectionsWrapper } from './styles';

const DEFAULT_SECTION: ICustomFormSection = {
  entity: 'user',
  names: {
    en: '',
    ru: '',
    uk: '',
    sk: '',
  },
  order: 0,
};

type Props = {
  value: string| null;
  onChange(v: string): void;
  entity: CustomFormEntity;
  error?: boolean;
}

const CustomSections = ({ value, onChange, entity, error }: Props) => {
  const { i18n, t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors }, getValues, setValue } = useForm<ICustomFormSection>();
  const queryClient = useQueryClient();

  const { data: customSections = [], refetch } = useGetCustomFormSections({ entity });
  const createSection = useCreateCustomFormSectionMutation();
  const updateSection = useUpdateCustomFormSectionMutation();
  const deleteSection = useDeleteCustomFormSectionMutation();

  const [sectionData, setSectionData] = useState<ICustomFormSection | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<ICustomFormSection | null>(null);

  const [nameToTranslate, setNameToTranslate] = useState<{ fromLang: string; text: '' } | null>(null);
  const debouncedNameToTranslate = useDebounce(nameToTranslate, 800);

  const getNearestOrder = () => {
    let order = 0;
    customSections.forEach((item) => {
      if (order === item.order) {
        order += 1;
      }
    });
    return order;
  };

  const isFreeOrder = (order: number) => customSections.every((item) => item.order.toString() !== order.toString());

  const submitSaveFormSection: SubmitHandler<ICustomFormSection> = (data) => {
    if (!data._id) {
      createSection.mutateAsync(data).then((res) => {
        queryClient.setQueryData(['customFormSections', JSON.stringify({ entity })], [...customSections, res]);
        setSectionData(null);
      });
    } else {
      updateSection.mutateAsync(data).then(() => {
        refetch();
        setSectionData(null);
      });
    }
  };

  const submitDeleteSection = () => {
    if (!sectionToDelete?._id) return;
    deleteSection.mutateAsync(sectionToDelete._id).then(() => {
      queryClient.setQueryData(
        ['customFormSections', JSON.stringify({ entity })],
        customSections.filter((item) => item._id !== sectionToDelete._id),
      );
      setSectionData(null);
      setSectionToDelete(null);
    });
  };

  useEffect(() => {
    if (sectionData !== null) {
      reset(sectionData);
    }
  }, [sectionData, reset]);

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
    <CustomSectionsWrapper error={error}>
      <RadioButtonGroup label={t('customForms.section')} className="sections-grid" value={value} onChange={(e) => void onChange(e.target.value)}>
        {customSections.map((item) => (
          <div key={item._id} className="section-radio-wrapper">
            <RadioButton label={item.names[i18n.language]} value={item._id} />
            <IconButton onClick={() => void setSectionData(item)}><EditIcon /></IconButton>
            <IconButton onClick={() => void setSectionToDelete(item)}><DeleteIcon /></IconButton>
            <p>{item.order}</p>
          </div>
        ))}
      </RadioButtonGroup>
      <div>
        <Button
          variant="outlined"
          onClick={() => void setSectionData({ ...DEFAULT_SECTION, entity, order: getNearestOrder() })}
        >
          <PlusIcon size={20} />{t('add')}
        </Button>
      </div>
      {!!sectionData && (
        <Dialog open={!!sectionData} onClose={() => void setSectionData(null)} title={t('customForms.section')}>
          <CustomSectionForm className="update-custom-field-form">
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
              <Input
                label={t('customForms.order')}
                InputLabelProps={{ shrink: true }}
                error={!!errors.order}
                type="number"
                {...register('order', { required: true, validate: isFreeOrder })}
              />
            </div>
            <div className="config-wrapper">
              <Button onClick={handleSubmit(submitSaveFormSection)}>{t('customForms.save')}</Button>
            </div>
          </CustomSectionForm>
        </Dialog>
      )}
      {sectionToDelete !== null && (
        <DialogConfirm open={!!sectionToDelete} onClose={() => void setSectionToDelete(null)} onSubmit={submitDeleteSection} />
      )}
    </CustomSectionsWrapper>
  );
};

export default CustomSections;
