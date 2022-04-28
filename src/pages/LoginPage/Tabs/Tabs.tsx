import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabsWrapper } from './styles';

type ActiveTab = 'login' | 'register'

type Props = {
  onChange(activeTab: ActiveTab): void;
  children: React.ReactNode;
}

const Tabs = ({ onChange, children }: Props) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('login');
  const { t } = useTranslation();

  const changeTabsHandler = (value: ActiveTab) => {
    setActiveTab(value);
    onChange(value);
  };

  return (
    <TabsWrapper>
      <div className="header">
        <span className={activeTab === 'login' ? 'active' : ''} onClick={() => void changeTabsHandler('login')}>{t('user.login')}</span>
        <span className={activeTab === 'register' ? 'active' : ''} onClick={() => void changeTabsHandler('register')}>{t('user.register')}</span>
      </div>
      <div className="content">
        {children}
      </div>
    </TabsWrapper>
  );
};

export default Tabs;
