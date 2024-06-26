import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { COUNTRIES } from 'v2/constants/countries';
import { Input } from 'v2/uikit';
import DatePicker from 'v2/uikit/DatePicker';
import Select from 'v2/uikit/Select';

import { UserPersonalDocType } from 'interfaces/users.interface';

import { PassInfo } from '../types';

import { CountrySelectOption, DocForm } from './styles';

type Props = {
  data: PassInfo;
  disabled?: boolean;
  onUpdate?(values: Partial<PassInfo> & { type: UserPersonalDocType }): void;
  triggerAllFields?: boolean;
};

const Pass = ({ data, disabled, onUpdate, triggerAllFields }: Props) => {
  const { t } = useTranslation();
  const { control, formState: { errors }, register, trigger, watch } = useForm<PassInfo>({ defaultValues: data });

  const values = watch();

  useEffect(() => {
    if (triggerAllFields) {
      trigger();
    }
  }, [trigger, triggerAllFields]);

  return (
    <DocForm>
      <div className="title">{t('user.idcard.idcard')}</div>
      <div className="fields">
        <Input
          label={t('user.passNumber')}
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
          options={COUNTRIES}
          labelPath={(data) => (
            <CountrySelectOption><img src={`https://flagcdn.com/w20/${data.code}.png`} className="mr-12" />{data.value}</CountrySelectOption>
          )}
          label={t('doc.issuerCountry')}
          defaultValue={data.country}
          error={!!errors.country}
          {...register('country', {
            required: true,
            onChange (e) {
              onUpdate?.({ ...values, country: e.target.value });
              setTimeout(() => {
                trigger('country');
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
            onChange (e) {
              onUpdate?.({ ...values, address: e.target.value });
            },
          })}
        />
      </div>
    </DocForm>
  );
};

export default Pass;
