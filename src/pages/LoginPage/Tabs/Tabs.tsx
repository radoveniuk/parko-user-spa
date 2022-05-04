import React from 'react';
import { useTranslation } from 'react-i18next';
import { TabsWrapper } from './styles';
import { useTabs } from './TabsContext';

type Props = {
  children: React.ReactNode;
}

const Tabs = ({ children }: Props) => {
  const [tab, setTab] = useTabs();
  const { t } = useTranslation();

  return (
    <TabsWrapper>
      <div className="header">
        <span className={tab === 'login' ? 'active' : ''} onClick={() => void setTab('login')}>{t('user.login')}</span>
        <span className={tab === 'register' ? 'active' : ''} onClick={() => void setTab('register')}>{t('user.register')}</span>
      </div>
      <div className="content">
        {children}
      </div>
    </TabsWrapper>
  );
};

export default Tabs;
