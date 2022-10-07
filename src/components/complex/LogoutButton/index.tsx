import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ExitIcon } from 'components/icons';
import Button from 'components/shared/Button';
import DialogConfirm from 'components/shared/DialogConfirm';
import { useLogout } from 'contexts/AuthContext';

type Props = {
  fullText?: boolean;
}

const LogoutButton = ({ fullText = true }: Props) => {
  const logout = useLogout();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Button onClick={() => void setOpen(true)} color="error" variant="outlined"><ExitIcon size={20} />{fullText && t('user.logout')}</Button>
      <DialogConfirm
        open={open}
        onSubmit={logoutHandler}
        onClose={() => void setOpen(false) }
      />
    </>
  );
};

export default LogoutButton;
