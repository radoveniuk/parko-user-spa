import LanguageSelector from 'components/complex/LanguageSelector';
import PageHeader from 'components/shared/PageHeader';
import React from 'react';
import LoginForm from './LoginForm';
import { LoginPageWrapper } from './styles';

const LoginPage = () => (
  <LoginPageWrapper>
    <PageHeader>
      <LanguageSelector />
    </PageHeader>
    <LoginForm />
  </LoginPageWrapper>
);

export default LoginPage;
