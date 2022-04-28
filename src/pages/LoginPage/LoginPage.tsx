import LanguageSelector from 'components/complex/LanguageSelector';
import PageHeader from 'components/shared/PageHeader';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { LoginPageWrapper } from './styles';
import Tabs from './Tabs';

const LoginPage = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  return (
    <LoginPageWrapper>
      <PageHeader>
        <LanguageSelector />
      </PageHeader>
      <Tabs onChange={setTab} >
        {tab === 'login' && <LoginForm />}
        {tab === 'register' && <RegisterForm />}
      </Tabs>
    </LoginPageWrapper>
  );
};

export default LoginPage;
