import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useLogout } from 'contexts/AuthContext';
import Button from 'components/shared/Button';
import { ExitIcon } from 'components/icons';

const LogoutButton = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  return (
    <Button onClick={logoutHandler} color="error" variant="outlined"><ExitIcon />{t('user.logout')}</Button>
  );
};

export default LogoutButton;
