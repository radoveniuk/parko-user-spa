import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useLogout } from 'contexts/AuthContext';
import Button from 'components/shared/Button';
import { ExitIcon } from 'components/icons';
import DialogConfirm from 'components/shared/DialogConfirm';

const LogoutButton = () => {
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
      <Button onClick={() => void setOpen(true)} color="error" variant="outlined"><ExitIcon />{t('user.logout')}</Button>
      <DialogConfirm
        open={open}
        onSubmit={logoutHandler}
        onClose={() => void setOpen(false) }
      />
    </>
  );
};

export default LogoutButton;
