import React from 'react';
import _ from 'lodash-es';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LoginFormWrapper } from './styles';
import { Link } from 'react-router-dom';

type FormFields = {
  login: string;
  password: string;
}

const LoginForm = () => {
  const { t } = useTranslation();
  const { handleSubmit, register, formState: { errors } } = useForm<FormFields>();

  const onSubmitLogin: SubmitHandler<FormFields> = (data) => console.log(data);
  return (
    <LoginFormWrapper>
      <div className="header">
        <span className="active">{t('user.login')}</span>
        <Link to="register">
          <span>{t('user.register')}</span>
        </Link>
      </div>
      <div className="fields">
        <span>{t('user.username')}</span>
        <input type="text" {...register('login', { required: true })} />
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
