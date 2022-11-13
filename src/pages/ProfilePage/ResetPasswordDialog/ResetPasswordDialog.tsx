import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLoginMutation, useUpdateUserMutation } from 'api/mutations/userMutation';
import Button from 'components/shared/Button';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import PasswordInput from 'components/shared/PasswordInput';

import { ResetPasswordWrapper } from './styles';

type Props = DialogProps & {
  email: string;
}

const ResetPasswordDialog = ({ email, ...props }: Props) => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [error, setError] = useState<null | string>(null);

  const login = useLoginMutation();
  const updateUserMutation = useUpdateUserMutation();

  const validateOldPassword = async () => {
    if (!oldPassword) {
      setError(t('errorTexts.wrongOldPassword'));
      return null;
    }
    const userData = await login.mutateAsync({ email, password: oldPassword })
      .catch(() => {
        setError(t('errorTexts.wrongOldPassword'));
      });

    if (userData) {
      setError(null);
    }
    return userData || null;
  };

  const validatePassword = useCallback(() => {
    if (!oldPassword) return;
    if (!password || !repeatPassword) {
      setError(t('errorTexts.emptyPassword'));
      return;
    }
    if (password !== repeatPassword) {
      setError(t('errorTexts.passwordsNotMatched'));
      return;
    }
    setError(null);
  }, [oldPassword, password, repeatPassword, t],
  );

  useEffect(() => void validatePassword(), [password, repeatPassword, validatePassword]);

  const submitHandler = async () => {
    const userData = await validateOldPassword();
    if (!userData) return null;

    updateUserMutation.mutateAsync({ ...userData, password: password })
      .then(() => {
        props.onClose();
      });
  };

  return (
    <Dialog {...props} title={t('user.resetPassword')}>
      <ResetPasswordWrapper>
        <PasswordInput
          label={t('user.oldPassword')}
          value={oldPassword}
          onChange={(e) => void setOldPassword(e.target.value)}
          onBlur={validateOldPassword}
          autoComplete="new-password"
        />
        <PasswordInput
          disabled={!oldPassword}
          label={t('user.newPassword')}
          value={password}
          onChange={(e) => void setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <PasswordInput
          disabled={!oldPassword}
          label={t('user.newPassword')}
          value={repeatPassword}
          onChange={(e) => void setRepeatPassword(e.target.value)}
          autoComplete="new-password"
        />
        <Button disabled={!!error} onClick={() => void submitHandler()}>{t('user.updateData')}</Button>
        <div className="error-wrapper">{error}</div>
      </ResetPasswordWrapper>
    </Dialog>
  );
};

export default ResetPasswordDialog;
