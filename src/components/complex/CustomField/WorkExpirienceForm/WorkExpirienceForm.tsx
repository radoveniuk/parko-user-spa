import React, { memo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import Select from 'v2/uikit/Select';

import { DeleteIcon, PlusIcon } from 'components/icons';
import { EXPIRIENCE_METHOD_OPTIONS } from 'constants/selectsOptions';
import createId from 'helpers/createId';

import { WorkExpirienceFormWrapper } from './styles';

type WorkExpirience = {
  company: string;
  dates: string;
  position: string;
  fireMethod: string;
  fireReason: string;
  matterId: string;
};

const getDefaultExpirience = (): WorkExpirience => ({
  company: '',
  dates: '',
  position: '',
  fireMethod: '',
  fireReason: '',
  matterId: createId(),
});

type Props = {
  defaultValues?: WorkExpirience[] | undefined;
  error?: boolean;
  disabled?: boolean;
  onChange(v: WorkExpirience[] | undefined): void;
};

const WorkExpirienceForm = ({ defaultValues = [], error, disabled, onChange }: Props) => {
  const { t } = useTranslation();
  const { register, setValue, watch, control } = useForm<{expiriences: WorkExpirience[]}>({ defaultValues: { expiriences: defaultValues || [] } });

  const { expiriences = [] } = watch();

  useEffect(() => {
    onChange(expiriences.length ? expiriences : undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiriences]);

  return (
    <WorkExpirienceFormWrapper className="fullwidth">
      {Array.isArray(expiriences) && expiriences?.map((expirienceForm, index) => (
        <div className="card" key={index}>
          <IconButton
            className="delete-btn"
            onClick={() => void setValue('expiriences', expiriences.filter(item => item.matterId !== expirienceForm.matterId))}
            disabled={disabled}
          >
            <DeleteIcon />
          </IconButton>
          <div className="title">{t('workExpirience.workExpirience')} {index + 1}</div>
          <div className="form">
            <Input
              label={t('workExpirience.company')}
              placeholder="Parko Limited s.r.o."
              disabled={disabled}
              {...register(`expiriences.${index}.company`)}
            />
            <Input
              label={t('workExpirience.dates')}
              placeholder="01/2022 - 02/2022"
              disabled={disabled}
              {...register(`expiriences.${index}.dates`)}
            />
            <Input
              label={t('workExpirience.position')}
              placeholder="Manažér"
              disabled={disabled}
              {...register(`expiriences.${index}.position`)}
            />
            <Controller
              control={control}
              name={`expiriences.${index}.fireMethod`}
              render={({ field }) => (
                <Select
                  label={t('workExpirience.fireMethod')}
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
              label={t('workExpirience.fireReason')}
              disabled={disabled}
              {...register(`expiriences.${index}.fireReason`)}
            />
          </div>
        </div>
      ))}
      <Button
        className="add-btn"
        variant="outlined"
        onClick={() => {
          setValue('expiriences', [...expiriences, getDefaultExpirience()]);
        }}
        disabled={disabled}
        color={!error ? 'primary' : 'error'}
      >
        <PlusIcon />{t('workExpirience.add')}
      </Button>
    </WorkExpirienceFormWrapper>
  );
};

export default memo(WorkExpirienceForm);
