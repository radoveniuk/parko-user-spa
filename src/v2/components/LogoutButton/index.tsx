import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from 'v2/uikit/Button';

import { IoExitOutlineIcon } from 'components/icons';
import DialogConfirm from 'components/shared/DialogConfirm';
import { useLogout } from 'contexts/AuthContext';

import { ButtonWrapper } from './styles';

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
      <ButtonWrapper>
        <Button
          onClick={() => void setOpen(true)}
          color="error"
          variant="text"
        >
          <IoExitOutlineIcon size={20}/> {fullText && t('user.logout')}
        </Button>
      </ButtonWrapper>
      <DialogConfirm
        open={open}
        onSubmit={logoutHandler}
        onClose={() => void setOpen(false) }
      />
    </>
  );
};

export default LogoutButton;
