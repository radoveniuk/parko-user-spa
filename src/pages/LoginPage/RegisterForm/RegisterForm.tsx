import React from 'react';
import _ from 'lodash-es';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import PhoneInputWithCountrySelect from 'react-phone-number-input';

import { RegisterUserDto } from 'interfaces/users.interface';
import { useRegisterMutation } from 'api/mutations/userMutation';

import { useTabs } from '../Tabs/TabsContext';

import { RegisterFormWrapper } from './styles';
import 'react-phone-number-input/style.css';

const RegisterForm = () => {
  const { t } = useTranslation();
  const { handleSubmit, register, formState: { errors }, control } = useForm<RegisterUserDto>();
  const registerMutation = useRegisterMutation();
  const { enqueueSnackbar } = useSnackbar();
  const [, setTab] = useTabs();

  const onSubmitLogin: SubmitHandler<RegisterUserDto> = async (data) => {
    registerMutation.mutateAsync({ ...data, role: 'user' })
      .then(() => {
        enqueueSnackbar(t('user.successfullRegister'), { variant: 'success' });
        setTab('login');
      })
      .catch(() => {
        enqueueSnackbar(t('user.failedRegister'), { variant: 'error' });
      });
  };

  return (
    <RegisterFormWrapper>
      <span className={`${errors.name ? 'error' : ''}`}>{t('user.name')}</span>
      <input type="text" {...register('name', { required: true })} />
      <span className={`${errors.surname ? 'error' : ''}`}>{t('user.surname')}</span>
      <input type="text" {...register('surname', { required: true })} />
      <span className={`${errors.email ? 'error' : ''}`}>{t('user.email')}</span>
      <input type="text" {...register('email', { required: true })} />
      <span className={`${errors.phone ? 'error' : ''}`}>{t('user.phone')}</span>
      <Controller
        control={control}
        name="phone"
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) => (
          <PhoneInputWithCountrySelect
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <span className={`${errors.password ? 'error' : ''}`}>{t('user.password')}</span>
      <input type="password" {...register('password', { required: true })} />
      <button
        onClick={handleSubmit(onSubmitLogin)}
        type="submit"
        disabled={!_.isEmpty(errors)}
      >
        {t('user.register')}
      </button>
    </RegisterFormWrapper>
  );
};

export default RegisterForm;
