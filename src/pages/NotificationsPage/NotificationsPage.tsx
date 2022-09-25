import React from 'react';
import { useTranslation } from 'react-i18next';

import Notifications from 'components/complex/Notifications';
import { EditIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Page, { PageTitle } from 'components/shared/Page';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import { useAuthData } from 'contexts/AuthContext';

import { CreateMessageLink } from './styles';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const { id } = useAuthData();
  const { role } = useAuthData();

  return (
    <Page title={t('notifications')}>
      <PageTitle>{t('notifications')}</PageTitle>
      <TabsContainer>
        <Tabs>
          <Tab label={t('notification.in')} />
          <Tab label={t('notification.out')} />
        </Tabs>
        <TabPanel index={0}>
          <Notifications options={{ to: id }} />
        </TabPanel>
        <TabPanel index={1}>
          <Notifications options={{ from: id }} mode="to" />
        </TabPanel>
      </TabsContainer>
      {role === 'admin' && (
        <CreateMessageLink to="/create-notification">
          <Button color="secondary"><EditIcon size={20} /></Button>
        </CreateMessageLink>
      )}
    </Page>
  );
};

export default NotificationsPage;
