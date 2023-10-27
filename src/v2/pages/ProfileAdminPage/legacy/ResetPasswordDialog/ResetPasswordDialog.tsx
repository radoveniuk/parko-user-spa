import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'components/shared/Button';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import PasswordInput from 'components/shared/PasswordInput';
import { IUser } from 'interfaces/users.interface';

import { ResetPasswordWrapper } from './styles';

type Props = DialogProps & {
  onUpdate(values: Partial<IUser>): void;
}

const ResetPasswordDialog = ({ onUpdate, ...props }: Props) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [error, setError] = useState<null | string>(null);

  const validatePassword = useCallback(() => {
    if (!password || !repeatPassword) {
      setError(t('errorTexts.emptyPassword'));
      return;
    }
    if (password !== repeatPassword) {
      setError(t('errorTexts.passwordsNotMatched'));
      return;
    }
    setError(null);
  }, [password, repeatPassword, t],
  );

  useEffect(() => void validatePassword(), [password, repeatPassword, validatePassword]);

  return (
    <Dialog {...props} title={t('user.resetPassword')}>
      <ResetPasswordWrapper>
        <PasswordInput
          label={t('user.newPassword')}
          value={password}
          onChange={(e) => void setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <PasswordInput
          label={t('user.newPassword')}
          value={repeatPassword}
          onChange={(e) => void setRepeatPassword(e.target.value)}
          autoComplete="new-password"
        />
        <Button disabled={!!error} onClick={() => void onUpdate({ password })}>{t('user.updateData')}</Button>
        <div className="error-wrapper">{error}</div>
      </ResetPasswordWrapper>
    </Dialog>
  );
};

export default ResetPasswordDialog;
