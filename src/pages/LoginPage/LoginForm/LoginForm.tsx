import React from 'react';
import _ from 'lodash-es';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LoginFormWrapper } from './styles';
import { useLogin } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

type FormFields = {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { t } = useTranslation();
  const { handleSubmit, register, formState: { errors } } = useForm<FormFields>();
  const login = useLogin();
  const navigate = useNavigate();

  const onSubmitLogin: SubmitHandler<FormFields> = async (data) => {
    const result = await login(data);
    if (result) {
      navigate('/');
    }
  };

  return (
    <LoginFormWrapper>
      <span>{t('user.email')}</span>
      <input type="text" {...register('email', { required: true })} />
      <span>{t('user.password')}</span>
      <input type="password" {...register('password', { required: { message: t('user.wrongPassword'), value: true } })} />
      <button
        onClick={handleSubmit(onSubmitLogin)}
        type="submit"
        disabled={!_.isEmpty(errors)}
      >
        {t('user.login')}
      </button>
    </LoginFormWrapper>
  );
};

export default LoginForm;
