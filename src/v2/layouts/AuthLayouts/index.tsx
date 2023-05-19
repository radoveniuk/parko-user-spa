import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useMatch } from 'react-router-dom';
import LanguageSelector from 'v2/components/LanguageSelector';
import Logo from 'v2/components/Logo';
import { Stack } from 'v2/uikit';

import { AuthWrapper } from './styles';

const AuthLayouts = () => {
  const { t } = useTranslation();
  const isLogin = useMatch('login');

  return (
    <AuthWrapper>
      <div className="auth-form">
        <Logo />
        <Outlet />
      </div>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3} className="stack-auth-layouts">
        <LanguageSelector className="lang-selector"/>
        {isLogin && <Link to="/sign-up" className="link-reg">{t('user.register')}</Link>}
        {!isLogin && <Link to="/login" className="link-reg">{t('user.login')}</Link>}
      </Stack>
    </AuthWrapper>
  );
};

export default AuthLayouts;
