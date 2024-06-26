import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';
import { Button, Input, Stack } from 'v2/uikit';
import PhoneInput, { checkPhoneNumber } from 'v2/uikit/PhoneInput';

import { useRegisterMutation } from 'api/mutations/userMutation';
import { validateEmail } from 'helpers/validateEmail';
import { RegisterUserDto } from 'interfaces/users.interface';

import { RegisterFormWrapper } from './styles';

const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handleSubmit, formState: { errors }, control } = useForm<RegisterUserDto>();

  const registerMutation = useRegisterMutation();

  const onSubmitLogin: SubmitHandler<RegisterUserDto> = async (data) => {
    registerMutation.mutateAsync({ ...data })
      .then(() => {
        navigate('/login');
      });
  };

  return (
    <RegisterFormWrapper>
      <Controller
        name="name"
        control={control}
        rules={{ required: { message: t('errorTexts.requiredField'), value: true } }}
        render={({ field }) => (
          <Input
            label={t('user.name')}
            type="text"
            helperText={errors.name?.message ?? ''}
            error={!isEmpty(errors.name)}
            theme="gray"
            {...field}
          />
        )}
      />
      <Controller
        name="surname"
        control={control}
        rules={{ required: { message: t('errorTexts.requiredField'), value: true } }}
        render={({ field }) => <Input
          label={t('user.surname')}
          type="text"
          helperText={errors.surname?.message ?? ''}
          error={!isEmpty(errors.surname)}
          theme="gray"
          {...field}
        />}
      />
      <Controller
        name="email"
        control={control}
        rules={{ required: { message: t('errorTexts.requiredField'), value: true }, validate: validateEmail }}
        render={({ field }) => <Input
          label={t('user.email')}
          type="text"
          helperText={errors.email?.message ?? ''}
          error={!isEmpty(errors.email)}
          theme="gray"
          {...field}
        />}
      />
      <Controller
        control={control}
        name="phone"
        defaultValue=""
        rules={{ required: { message: t('errorTexts.requiredField'), value: true }, validate: checkPhoneNumber as any }}
        render={({ field }) => (
          <PhoneInput
            {...field}
            error={!isEmpty(errors.phone)}
            helperText={errors.phone?.message ?? ''}
            theme="gray"
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{ required: { message: t('errorTexts.requiredField'), value: true } }}
        render={({ field }) => <Input
          label={t('user.password')}
          type="password"
          showPasswordIcon
          helperText={errors.password?.message ?? ''}
          error={!isEmpty(errors.password)}
          theme="gray"
          {...field}
        />}
      />
      <Stack direction="row" justifyContent="end" alignItems="center" mt={'14px'}>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit(onSubmitLogin)}
          disabled={!isEmpty(errors)}
        >
          {t('user.register')}
        </Button>
      </Stack>

    </RegisterFormWrapper>
  );
};

export default RegisterForm;
