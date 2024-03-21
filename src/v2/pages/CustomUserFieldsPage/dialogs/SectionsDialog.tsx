import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';

import { useGetCustomFormSections } from 'api/query/customFormsQuery';
import { fetchTranslation } from 'api/query/translationQuery';
import { DeleteIcon, FormIcon } from 'components/icons';
import { LANGUAGES } from 'constants/languages';
import { getDateFromIso } from 'helpers/datetime';
import useDebounce from 'hooks/useDebounce';
import { ICustomFormSection } from 'interfaces/form.interface';

import useSectionActions from '../hooks/useSectionActions';

import { CategoriesWrapper } from './styles';

export const SectionsDialog = (props: DialogProps) => {
  const { t, i18n } = useTranslation();

  const { register, getValues, setValue, formState: { errors }, handleSubmit, clearErrors } = useForm<ICustomFormSection>();

  const { data = [] } = useGetCustomFormSections({ entity: 'user' });
  const { create, remove } = useSectionActions();

  const createSection: SubmitHandler<ICustomFormSection> = (values) => {
    create(values);
    LANGUAGES.forEach((item) => {
      setValue(`names.${item.code}`, '');
    });
  };

  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const deleteSection = () => {
    if (!sectionToDelete) return;
    remove(sectionToDelete);
    setSectionToDelete(null);
  };

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
            clearErrors();
          });
        });
    }
  }, [clearErrors, debouncedNameToTranslate, getValues, setValue]);

  return (
    <>
      <Dialog {...props} title={t('customForms.sections')} mobileFullscreen>
        <CategoriesWrapper>
          <div className="form">
            {LANGUAGES.map((item) => (
              <Input
                key={item.code}
                label={`${t('customForms.names')} (${item.code})`}
                InputLabelProps={{ shrink: true }}
                error={!!errors?.names?.[item.code]}
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
          </div>
          <div className="actions">
            <Button variant="outlined" onClick={handleSubmit(createSection)}>{t('add')}</Button>
          </div>
          <div className="categories">
            {data.map((section) => (
              <div className="category" key={section._id}>
                <FormIcon size={20} />
                <div className="name">{section.names[i18n.language]}</div>
                <div className="date">{getDateFromIso(section.createdAt)}</div>
                <IconButton onClick={() => void setSectionToDelete(section._id as string)}><DeleteIcon size={14} /></IconButton>
              </div>
            ))}
          </div>
        </CategoriesWrapper>
      </Dialog>
      {!!sectionToDelete && (
        <DialogConfirm
          onSubmit={deleteSection}
          onClose={() => void setSectionToDelete(null)}
          open={!!sectionToDelete}
        />
      )}
    </>
  );
};
