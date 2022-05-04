import React from 'react';
import _ from 'lodash-es';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

import { RegisterUserDto } from 'interfaces/users.interface';
import { useRegisterMutation } from 'api/mutations/userMutation';

import { RegisterFormWrapper } from './styles';
import { useTabs } from '../Tabs/TabsContext';

const RegisterForm = () => {
  const { t } = useTranslation();
  const { handleSubmit, register, formState: { errors } } = useForm<RegisterUserDto>();
  const registerMutation = useRegisterMutation();
  const { enqueueSnackbar } = useSnackbar();
  const [, setTab] = useTabs();

  const onSubmitLogin: SubmitHandler<RegisterUserDto> = async (data) => {
    registerMutation.mutateAsync(data)
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
      <span>{t('user.name')}</span>
      <input type="text" {...register('name', { required: true })} />
      <span>{t('user.surname')}</span>
      <input type="text" {...register('surname', { required: true })} />
      <span>{t('user.email')}</span>
      <input type="text" {...register('email', { required: true })} />
      <span>{t('user.phone')}</span>
      <input type="text" {...register('phone', { required: true })} />
      <span>{t('user.password')}</span>
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
