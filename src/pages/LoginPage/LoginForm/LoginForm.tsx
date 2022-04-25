import React from 'react';
import _ from 'lodash-es';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LoginFormWrapper } from './styles';
import { Link } from 'react-router-dom';
import { useLogin } from 'api/mutations/userMutation';

type FormFields = {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { t } = useTranslation();
  const { handleSubmit, register, formState: { errors } } = useForm<FormFields>();
  const loginMutation = useLogin();

  const onSubmitLogin: SubmitHandler<FormFields> = async (data) => {
    const items = await loginMutation.mutateAsync(data);
    console.log(items);
  };

  return (
    <LoginFormWrapper>
      <div className="header">
        <span className="active">{t('user.login')}</span>
        <Link to="register">
          <span>{t('user.register')}</span>
        </Link>
      </div>
      <div className="fields">
        <span>{t('user.email')}</span>
        <input type="text" {...register('email', { required: true })} />
        <span>{t('user.password')}</span>
        <input type="text" {...register('password', { required: { message: t('user.wrongPassword'), value: true } })} />
        <button
          onClick={handleSubmit(onSubmitLogin)}
          type="submit"
          disabled={!_.isEmpty(errors)}
        >
          {t('user.login')}
        </button>
      </div>
    </LoginFormWrapper>
  );
};

export default LoginForm;
