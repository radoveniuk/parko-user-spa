import React from 'react';
import LanguageSelector from 'components/complex/LanguageSelector';
import PageHeader from 'components/shared/PageHeader';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { LoginPageWrapper } from './styles';
import Tabs from './Tabs';
import TabsProvider, { useTabs } from './Tabs/TabsContext';

const PageContent = () => {
  const [tab] = useTabs();
  return (
    <LoginPageWrapper>
      <PageHeader className="login-header">
        <LanguageSelector className="lang-selector" />
      </PageHeader>
      <Tabs>
        {tab === 'login' && <LoginForm />}
        {tab === 'register' && <RegisterForm />}
      </Tabs>
    </LoginPageWrapper>
  );
};

const LoginPage = () => (
  <TabsProvider>
    <PageContent />
  </TabsProvider>
);

export default LoginPage;
