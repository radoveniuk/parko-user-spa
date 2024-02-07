import React, { memo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Checkbox, Input } from 'v2/uikit';
import DatePicker from 'v2/uikit/DatePicker';
import Select from 'v2/uikit/Select';

import { PERMIT_TYPES } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { UserPersonalDocType } from 'interfaces/users.interface';

import { PermitInfo } from '../types';

import { DocForm } from './styles';

type Props = {
  data: PermitInfo;
  disabled?: boolean;
  onUpdate?(values: Partial<PermitInfo> & { type: UserPersonalDocType }): void;
  triggerAllFields?: boolean;
};

const Permit = ({ data, disabled, onUpdate, triggerAllFields }: Props) => {
  const { t } = useTranslation();
  const translatedPermitTypeList = useTranslatedSelect(PERMIT_TYPES, 'permitType');
  const { control, formState: { errors }, register, trigger, watch } = useForm<PermitInfo>({ defaultValues: data });

  const values = watch();

  useEffect(() => {
    if (triggerAllFields) {
      trigger();
    }
  }, [trigger, triggerAllFields]);

  return (
    <DocForm>
      <div className="title">{t('user.permit.permit')}</div>
      <div className="fields">
        <Input
          label={t('user.permitCardNumber')}
          disabled={disabled}
          error={!!errors.number}
          {...register('number', {
            required: true,
            onBlur () {
              trigger('number');
            },
            onChange (e) {
              trigger('number');
              onUpdate?.({ ...values, number: e.target.value });
            },
          })}
        />
        <Select
          disabled={disabled}
          options={translatedPermitTypeList}
          label={t('user.permitGoal')}
          defaultValue={data.goal}
          error={!!errors.goal}
          {...register('goal', {
            required: true,
            onChange (e) {
              onUpdate?.({ ...values, goal: e.target.value });
              setTimeout(() => {
                trigger('goal');
              }, 100);
            },
          })}
        />
        <Controller
          control={control}
          name="dateFrom"
          rules={{
            required: true,
            onBlur () {
              trigger('dateFrom');
            },
            onChange (e) {
              trigger('dateFrom');
              onUpdate?.({ ...values, dateFrom: e.target.value });
            },
          }}
          render={({ field }) => (
            <DatePicker
              disabled={disabled}
              defaultValue={field.value}
              onChange={field.onChange}
              label={t('doc.dateFrom')}
              error={!!errors.dateFrom}
              onBlur={field.onBlur}
            />
          )}
        />
        <Controller
          control={control}
          name="dateTo"
          rules={{
            required: true,
            onBlur () {
              trigger('dateTo');
            },
            onChange (e) {
              trigger('dateTo');
              onUpdate?.({ ...values, dateTo: e.target.value });
            },
          }}
          render={({ field }) => (
            <DatePicker
              disabled={disabled}
              defaultValue={field.value}
              onChange={field.onChange}
              label={t('doc.dateTo')}
              error={!!errors.dateTo}
              onBlur={field.onBlur}
            />
          )}
        />
        <Input
          className="fullwidth"
          label={t('user.adress')}
          disabled={disabled}
          error={!!errors.address}
          {...register('address', {
            required: true,
            onBlur () {
              trigger('address');
            },
            onChange (e) {
              trigger('address');
              onUpdate?.({ ...values, address: e.target.value });
            },
          })}
        />
        <Controller
          control={control}
          name="isMedicalCheck"
          render={({ field }) => (
            <Checkbox
              disabled={disabled}
              label={t('user.hasMedicalExamination')}
              onChange={(e) => { field.onChange(e.target.checked); onUpdate?.({ ...values, isMedicalCheck: e.target.checked }); }}
              checked={field.value}
            />
          )}
        />
      </div>
    </DocForm>
  );
};

export default memo(Permit);
