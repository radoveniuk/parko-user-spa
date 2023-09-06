import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash-es';

import { useLogin } from 'contexts/AuthContext';

import PasswordInput from '../components/PasswordInput';

import { LoginFormWrapper } from './styles';

type FormFields = {
  nickname: string;
  password: string;
}

const LoginForm = () => {
  const { t } = useTranslation();
  const { handleSubmit, register, formState: { errors } } = useForm<FormFields>();
  const login = useLogin();
  const navigate = useNavigate();

  const onSubmitLogin: SubmitHandler<FormFields> = async (data) => {
    login(data)
      .then(() => { navigate('/'); });
  };

  return (
    <LoginFormWrapper onSubmit={handleSubmit(onSubmitLogin)}>
      <span>{t('user.nickname')}</span>
      <input type="text" {...register('nickname', { required: true })} />
      <span>{t('user.password')}</span>
      <PasswordInput {...register('password', { required: { message: t('user.wrongPassword'), value: true } })} />
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
