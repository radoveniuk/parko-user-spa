import React, { memo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from 'v2/uikit';
import DatePicker from 'v2/uikit/DatePicker';

import { UserPersonalDocType } from 'interfaces/users.interface';

import { VisaInfo } from '../types';

import { DocForm } from './styles';

type Props = {
  data: VisaInfo;
  disabled?: boolean;
  onUpdate?(values: Partial<VisaInfo> & { type: UserPersonalDocType }): void;
  triggerAllFields?: boolean;
};

const Visa = ({ data, disabled, onUpdate, triggerAllFields }: Props) => {
  const { t } = useTranslation();
  const { control, formState: { errors }, register, trigger, watch } = useForm<VisaInfo>({ defaultValues: data });

  const values = watch();

  useEffect(() => {
    if (triggerAllFields) {
      trigger();
    }
  }, [trigger, triggerAllFields]);

  return (
    <DocForm>
      <div className="title">{t('user.visa.visa')}</div>
      <div className="fields">
        <Input
          label={t('user.visaNumber')}
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
          label={t('comment')}
          disabled={disabled}
          multiline
          className="fullwidth"
          {...register('comment', {
            onChange (e) {
              onUpdate?.({ ...values, comment: e.target.value });
            },
          })}
        />
      </div>
    </DocForm>
  );
};

export default memo(Visa);
