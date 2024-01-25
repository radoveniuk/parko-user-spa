import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash-es';
import { Button, Input, Stack } from 'v2/uikit';

import { useLogin } from 'contexts/AuthContext';

import { LoginFormWrapper } from './styles';

type FormFields = {
  nickname: string;
  password: string;
}

const LoginForm = () => {
  const { t } = useTranslation();
  const { handleSubmit, formState: { errors }, control } = useForm<FormFields>();
  const login = useLogin();
  const navigate = useNavigate();

  const onSubmitLogin: SubmitHandler<FormFields> = async (data) => {
    login(data)
      .then(() => { navigate('/'); });
  };

  return (
    <LoginFormWrapper onSubmit={handleSubmit(onSubmitLogin)}>
      <Controller
        name="nickname"
        control={control}
        rules={{ required: { message: t('errorTexts.requiredField'), value: true } }}
        render={({ field }) => (
          <Input
            label={t('user.email')}
            type="text"
            helperText={errors.nickname?.message ?? ''}
            error={!_.isEmpty(errors.nickname)}
            theme="gray"
            {...field}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{ required: { message: t('errorTexts.requiredField'), value: true } }}
        render={({ field }) => (
          <Input
            label={t('user.password')}
            type="password"
            showPasswordIcon
            helperText={errors.password?.message ?? ''}
            error={!_.isEmpty(errors.password)}
            theme="gray"
            {...field}
          />
        )}
      />
      <Stack direction="row" justifyContent="end" alignItems="center" mt={'14px'}>
        <Button type="submit" variant="contained" disabled={!_.isEmpty(errors)}>{t('user.login')}</Button>
      </Stack>
    </LoginFormWrapper>
  );
};

export default LoginForm;
