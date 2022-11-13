import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import _ from 'lodash-es';

import { useRegisterMutation } from 'api/mutations/userMutation';
import PhoneInput, { checkPhoneNumber } from 'components/shared/PhoneInput';
import { validateEmail } from 'helpers/validateEmail';
import { RegisterUserDto } from 'interfaces/users.interface';

import PasswordInput from '../components/PasswordInput';
import { useTabs } from '../Tabs/TabsContext';

import { RegisterFormWrapper } from './styles';

const RegisterForm = () => {
  const { t } = useTranslation();
  const { handleSubmit, register, formState: { errors }, control } = useForm<RegisterUserDto>();
  const registerMutation = useRegisterMutation();
  const [, setTab] = useTabs();

  const onSubmitLogin: SubmitHandler<RegisterUserDto> = async (data) => {
    registerMutation.mutateAsync({ ...data, role: 'user' })
      .then(() => {
        setTab('login');
      });
  };

  return (
    <RegisterFormWrapper>
      <span className={`${errors.name ? 'error' : ''}`}>{t('user.name')}</span>
      <input type="text" {...register('name', { required: true })} />
      <span className={`${errors.surname ? 'error' : ''}`}>{t('user.surname')}</span>
      <input type="text" {...register('surname', { required: true })} />
      <span className={`${errors.email ? 'error' : ''}`}>{t('user.email')}</span>
      <input type="text" {...register('email', { validate: validateEmail })} />
      <span className={`${errors.phone ? 'error' : ''}`}>{t('user.phone')}</span>
      <Controller
        control={control}
        name="phone"
        defaultValue=""
        rules={{ required: true, validate: checkPhoneNumber }}
        render={({ field }) => (
          <PhoneInput
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <span className={`${errors.password ? 'error' : ''}`}>{t('user.password')}</span>
      <PasswordInput {...register('password', { required: true })} />
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
