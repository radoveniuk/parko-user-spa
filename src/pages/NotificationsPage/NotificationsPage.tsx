import React from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import Notifications from 'components/complex/Notifications';
import { NotificationIcon } from 'components/icons';
import Button from 'components/shared/Button';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import { useAuthData } from 'contexts/AuthContext';

import { CreateMessageLink } from './styles';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const { id } = useAuthData();
  const { role } = useAuthData();
  useDocumentTitle(t('notifications'));

  return (
    <>
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
      {['admin', 'recruiter', 'super-admin'].includes(role as string) && (
        <CreateMessageLink to="/create-notification">
          <Button><NotificationIcon size={20} /></Button>
        </CreateMessageLink>
      )}
    </>
  );
};

export default NotificationsPage;
