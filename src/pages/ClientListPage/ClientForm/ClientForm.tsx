import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import DatePicker from 'components/shared/DatePicker';
import Input from 'components/shared/Input';
import PhoneInput, { checkPhoneNumber } from 'components/shared/PhoneInput';
import { validateEmail } from 'helpers/validateEmail';
import { IClient } from 'interfaces/client.interface';

import { ClientFormWrapper } from './styles';

export default function ClientForm () {
  const { t } = useTranslation();
  const { register, control, formState: { errors } } = useFormContext<IClient>();

  return (
    <ClientFormWrapper>
      <Input label={t('client.company')} error={!!errors.name} {...register('name', { required: true })} />
      <Input label={t('client.ICO')} {...register('ICO')} />
      <Input label={t('client.DIC')} {...register('DIC')} />
      <Input label={t('client.ICDPH')} {...register('ICDPH')} />
      <Input label={t('client.sidlo')} {...register('sidlo')} />
      <Input label={t('client.websiteUrl')} {...register('websiteUrl')} />
      <Input label={t('client.contactPerson')} {...register('contactPerson')} />
      <Input label={t('client.contactPersonPosition')} {...register('contactPersonPosition')} />
      <Input label={t('Email')} {...register('email', { validate: (v) => !v || validateEmail(v) })} />
      <Controller
        control={control}
        name="phone"
        defaultValue=""
        rules={{ validate: (value) => !value || checkPhoneNumber(value) }}
        render={({ field }) => (
          <PhoneInput
            value={field.value}
            onChange={field.onChange}
            label={t('client.phone')}
            error={!!errors.phone}
          />
        )}
      />
      <Input label={t('client.status')} {...register('status')} />
      <Controller
        control={control}
        name="cooperationStartDate"
        defaultValue={DateTime.now().toISO()}
        render={({ field }) => (
          <DatePicker
            value={field.value}
            onChange={field.onChange}
            label={t('client.cooperationStartDate')}
          />
        )}
      />
      <Controller
        control={control}
        name="cooperationEndDate"
        defaultValue={DateTime.now().toISO()}
        render={({ field }) => (
          <DatePicker
            value={field.value}
            onChange={field.onChange}
            label={t('client.cooperationEndDate')}
          />
        )}
      />
    </ClientFormWrapper>
  );
};
