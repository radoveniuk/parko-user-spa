/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  useCreateCustomFormSectionMutation,
  useDeleteCustomFormSectionMutation,
  useUpdateCustomFormSectionMutation,
} from 'api/mutations/customFormsMutation';
import { useGetCustomFormSections } from 'api/query/customFormsQuery';
import { DeleteIcon, EditIcon, PlusIcon } from 'components/icons';
import Button from 'components/shared/Button';
import IconButton from 'components/shared/IconButton';
import RadioButtonGroup, { RadioButton } from 'components/shared/RadioButtonGroup';
import { CustomFormEntity, ICustomFormSection } from 'interfaces/form.interface';
import Dialog from 'components/shared/Dialog';
import { LANGUAGES } from 'constants/languages';
import Input from 'components/shared/Input';

import { CustomSectionForm } from './styles';
import { useQueryClient } from 'react-query';
import DialogConfirm from 'components/shared/DialogConfirm';

const DEFAULT_SECTION: ICustomFormSection = {
  entity: 'user',
  names: {
    en: '',
    ru: '',
    uk: '',
    sk: '',
  },
};

type Props = {
  value: string| null,
  onChange(v: string): void,
  entity: CustomFormEntity,
}

const CustomSections = ({ value, onChange, entity }: Props) => {
  const { i18n, t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors }, control } = useForm<ICustomFormSection>();
  const queryClient = useQueryClient();

  const { data: customSections = [], refetch } = useGetCustomFormSections({ entity });
  const createSection = useCreateCustomFormSectionMutation();
  const updateSection = useUpdateCustomFormSectionMutation();
  const deleteSection = useDeleteCustomFormSectionMutation();

  const [sectionData, setSectionData] = useState<ICustomFormSection | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<ICustomFormSection | null>(null);

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

  return (
    <div>
      <RadioButtonGroup label={t('customForms.section')} value={value} onChange={(e) => void onChange(e.target.value)}>
        {customSections.map((item) => (
          <div key={item._id} className="section-radio-wrapper">
            <RadioButton label={item.names[i18n.language]} value={item._id} />
            <IconButton onClick={() => void setSectionData(item)}><EditIcon /></IconButton>
            <IconButton onClick={() => void setSectionToDelete(item)}><DeleteIcon /></IconButton>
          </div>
        ))}
      </RadioButtonGroup>
      <div>
        <Button variant="outlined" onClick={() => void setSectionData({ ...DEFAULT_SECTION, entity })}><PlusIcon size={20} />{t('add')}</Button>
      </div>
      {!!sectionData && (
        <Dialog open={!!sectionData} onClose={() => void setSectionData(null)} title={t('customForms.section')}>
          <CustomSectionForm onSubmit={handleSubmit(submitSaveFormSection)} className="update-custom-field-form">
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
            <div className="config-wrapper">
              <Button type="submit">{t('customForms.save')}</Button>
            </div>
          </CustomSectionForm>
        </Dialog>
      )}
      {sectionToDelete !== null && (
        <DialogConfirm open={!!sectionToDelete} onClose={() => void setSectionToDelete(null)} onSubmit={submitDeleteSection} />
      )}
    </div>
  );
};

export default CustomSections;
