import React from 'react';
import _ from 'lodash-es';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { useLogin } from 'contexts/AuthContext';

import { LoginFormWrapper } from './styles';

type FormFields = {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { t } = useTranslation();
  const { handleSubmit, register, formState: { errors } } = useForm<FormFields>();
  const login = useLogin();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmitLogin: SubmitHandler<FormFields> = async (data) => {
    login(data)
      .then(() => { navigate('/'); })
      .catch(() => {
        enqueueSnackbar(t('user.wrongCredentials'), { variant: 'error' });
      });
  };

  return (
    <LoginFormWrapper onSubmit={handleSubmit(onSubmitLogin)}>
      <span>{t('user.email')}</span>
      <input type="text" {...register('email', { required: true })} />
      <span>{t('user.password')}</span>
      <input type="password" {...register('password', { required: { message: t('user.wrongPassword'), value: true } })} />
      <button
        type="submit"
        disabled={!_.isEmpty(errors)}
      >
        {t('user.login')}
      </button>
    </LoginFormWrapper>
  );
};

export default LoginForm;
