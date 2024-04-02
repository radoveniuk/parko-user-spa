import React, { memo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import Select from 'v2/uikit/Select';

import { DeleteIcon, PlusIcon } from 'components/icons';
import { EXPIRIENCE_METHOD_OPTIONS } from 'constants/selectsOptions';
import createId from 'helpers/createId';

import { WorkExperienceFormWrapper } from './styles';

type WorkExperience = {
  company: string;
  dates: string;
  position: string;
  fireMethod: string;
  fireReason: string;
  matterId: string;
};

const getDefaultExperience = (): WorkExperience => ({
  company: '',
  dates: '',
  position: '',
  fireMethod: '',
  fireReason: '',
  matterId: createId(),
});

type Props = {
  defaultValues?: WorkExperience[] | undefined;
  error?: boolean;
  disabled?: boolean;
  onChange(v: WorkExperience[] | undefined): void;
};

const WorkExperienceForm = ({ defaultValues = [], error, disabled, onChange }: Props) => {
  const { t } = useTranslation();
  const { register, setValue, watch, control } = useForm<{experiences: WorkExperience[]}>({ defaultValues: { experiences: defaultValues || [] } });

  const { experiences = [] } = watch();

  useEffect(() => {
    onChange(experiences.length ? experiences : undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiences]);

  return (
    <WorkExperienceFormWrapper className="fullwidth">
      {Array.isArray(experiences) && experiences?.map((experienceForm, index) => (
        <div className="card" key={index}>
          <IconButton
            className="delete-btn"
            onClick={() => void setValue('experiences', experiences.filter(item => item.matterId !== experienceForm.matterId))}
            disabled={disabled}
          >
            <DeleteIcon />
          </IconButton>
          <div className="title">{t('workExperience.workExperience')} {index + 1}</div>
          <div className="form">
            <Input
              label={t('workExperience.company')}
              placeholder="Parko Limited s.r.o."
              disabled={disabled}
              {...register(`experiences.${index}.company`)}
            />
            <Input
              label={t('workExperience.dates')}
              placeholder="01/2022 - 02/2022"
              disabled={disabled}
              {...register(`experiences.${index}.dates`)}
            />
            <Input
              label={t('workExperience.position')}
              placeholder="Manažér"
              disabled={disabled}
              {...register(`experiences.${index}.position`)}
            />
            <Controller
              control={control}
              name={`experiences.${index}.fireMethod`}
              render={({ field }) => (
                <Select
                  label={t('workExperience.fireMethod')}
                  disabled={disabled}
                  options={EXPIRIENCE_METHOD_OPTIONS}
                  valuePath="value"
                  labelPath="label"
                  value={field.value}
                  onChange={(e) => void field.onChange(e.target.value)}
                />
              )}
            />
            <Input
              label={t('workExperience.fireReason')}
              disabled={disabled}
              {...register(`experiences.${index}.fireReason`)}
            />
          </div>
        </div>
      ))}
      <Button
        className="add-btn"
        variant="outlined"
        onClick={() => {
          setValue('experiences', [...experiences, getDefaultExperience()]);
        }}
        disabled={disabled}
        color={!error ? 'primary' : 'error'}
      >
        <PlusIcon />{t('workExperience.add')}
      </Button>
    </WorkExperienceFormWrapper>
  );
};

export default memo(WorkExperienceForm);
