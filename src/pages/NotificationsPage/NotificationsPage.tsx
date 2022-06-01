import React, { useState } from 'react';
import Page, { PageTitle } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';
import List from 'components/shared/List';
import { INotification } from 'interfaces/notification.interface';
import { EmptyDataWrapper, NotificationPageWrapper } from './styles';
import { NotificationContent, NotificationText, NotificationTitle } from './NotificationContent';
import { useGetNotifications } from 'api/query/notificationsQuery';
import { useAuthData } from 'contexts/AuthContext';

const fields = {
  primary: 'title',
  secondary: 'from',
};

const NotificationsPage = () => {
  const { t } = useTranslation();
  const { id } = useAuthData();
  const { data = [] } = useGetNotifications({ to: id });
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null);
  return (
    <Page title={t('notifications')}>
      <PageTitle>{t('notifications')}</PageTitle>
      {!!data.length && (
        <NotificationPageWrapper>
          <List
            className="notifications-list"
            data={data}
            fields={fields}
            onSelect={(notification) => void setSelectedNotification(notification)}
          />
          {selectedNotification !== null && (
            <NotificationContent>
              <NotificationTitle>{selectedNotification.title}</NotificationTitle>
              <NotificationText>{selectedNotification.message}</NotificationText>
            </NotificationContent>
          )}
        </NotificationPageWrapper>
      )}
      {!data.length && (
        <EmptyDataWrapper>
          {t('noData')}
        </EmptyDataWrapper>
      )}
    </Page>
  );
};

export default NotificationsPage;