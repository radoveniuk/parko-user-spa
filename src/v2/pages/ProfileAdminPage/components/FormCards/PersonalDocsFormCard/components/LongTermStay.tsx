import React, { memo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from 'v2/uikit';
import DatePicker from 'v2/uikit/DatePicker';

import { UserPersonalDocType } from 'interfaces/users.interface';

import { LongTermStayInfo } from '../types';

import { DocForm } from './styles';

type Props = {
  data: LongTermStayInfo;
  disabled?: boolean;
  onUpdate?(values: Partial<LongTermStayInfo> & { type: UserPersonalDocType }): void;
  triggerAllFields?: boolean;
};

const LongTermStay = ({ data, disabled, onUpdate, triggerAllFields }: Props) => {
  const { t } = useTranslation();
  const { control, formState: { errors }, register, trigger, watch } = useForm<LongTermStayInfo>({ defaultValues: data });

  const values = watch();

  useEffect(() => {
    if (triggerAllFields) {
      trigger();
    }
  }, [trigger, triggerAllFields]);

  return (
    <DocForm>
      <div className="title">{t('user.longtermstay.longtermstay')}</div>
      <div className="fields">
        <Input
          label={t('doc.number')}
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
      </div>
    </DocForm>
  );
};

export default memo(LongTermStay);
