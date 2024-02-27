import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from 'v2/uikit/Button';
import DialogConfirm from 'v2/uikit/DialogConfirm';

import { ExitIcon } from 'components/icons';
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
    <div>
      <Button
        onClick={() => void setOpen(true)}
        color="error"
        variant="outlined"
        style={{ minWidth: 0 }}
      >
        <ExitIcon size={20} />{fullText && t('user.logout')}
      </Button>
      <DialogConfirm
        open={open}
        onSubmit={logoutHandler}
        onClose={() => void setOpen(false) }
      />
    </div>
  );
};

export default LogoutButton;
