import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import DatePicker from 'v2/uikit/DatePicker';
import Input from 'components/shared/Input';
import PhoneInput, { checkPhoneNumber } from 'components/shared/PhoneInput';
import Select from 'components/shared/Select';
import { CLIENT_STATUS } from 'constants/selectsOptions';
import { validateEmail } from 'helpers/validateEmail';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IClient } from 'interfaces/client.interface';

import { ClientFormWrapper } from './styles';

type Props = {
  defaultValues?: IClient;
};

export default function ClientForm ({ defaultValues }: Props) {
  const { t } = useTranslation();
  const { register, control, formState: { errors } } = useFormContext<IClient>();

  const statuses = useTranslatedSelect(CLIENT_STATUS, 'clientStatus');

  return (
    <ClientFormWrapper>
      <Input label={`${t('client.company')}*`} error={!!errors.name} {...register('name', { required: true })} />
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
      <Select label={t('client.status')} options={statuses} defaultValue={defaultValues?.status} {...register('status')} />
      <Controller
        control={control}
        name="cooperationStartDate"
        render={({ field }) => (
          <DatePicker
            defaultValue={field.value}
            onChange={field.onChange}
            label={t('client.cooperationStartDate')}
          />
        )}
      />
      <Controller
        control={control}
        name="cooperationEndDate"
        render={({ field }) => (
          <DatePicker
            defaultValue={field.value}
            onChange={field.onChange}
            label={t('client.cooperationEndDate')}
          />
        )}
      />
    </ClientFormWrapper>
  );
};
