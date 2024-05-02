import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PasswordInput from 'v2/components/PasswordInput';
import Button from 'v2/uikit/Button';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';

import { IUser } from 'interfaces/users.interface';

import { ResetPasswordWrapper } from './styles';

type Props = DialogProps & {
  onUpdate(values: Pick<IUser, 'password'>): void;
}

const ResetPasswordDialog = ({ onUpdate, ...props }: Props) => {
  const { t } = useTranslation();
  const { register, getValues, formState: { errors }, handleSubmit } = useForm<{ pass: string; rPass: string }>();

  return (
    <Dialog {...props} title={t('user.resetPassword')}>
      <ResetPasswordWrapper>
        <PasswordInput
          theme="gray"
          label={t('user.newPassword')}
          autoComplete="new-password"
          error={!!errors.pass?.message}
          helperText={errors.pass?.message}
          {...register('pass', { required: t('errorTexts.emptyPassword') })}
        />
        <PasswordInput
          theme="gray"
          label={t('user.newPassword')}
          autoComplete="new-password"
          error={!!errors.rPass?.message}
          helperText={errors.rPass?.message}
          {...register('rPass', {
            required: t('errorTexts.emptyPassword'),
            validate: (v) => v === getValues('pass') ? true : t('errorTexts.passwordsNotMatched'),
          })}
        />
        <Button
          onClick={handleSubmit(({ pass }) => {
            onUpdate({ password: pass });
            props.onClose();
          })}
          color="error"
          variant="outlined"
        >
          {t('user.updateData')}
        </Button>
      </ResetPasswordWrapper>
    </Dialog>
  );
};

export default ResetPasswordDialog;
