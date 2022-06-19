import React, { useState } from 'react';
import Page, { PageTitle } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';

import List from 'components/shared/List';
import { INotification } from 'interfaces/notification.interface';
import { NotificationContent, NotificationTitle } from './NotificationContent';
import { useGetNotifications } from 'api/query/notificationsQuery';
import { useAuthData } from 'contexts/AuthContext';
import Button from 'components/shared/Button';
import { EditIcon } from 'components/icons';
import { useUpdateNotificationMutation } from 'api/mutations/notificationMutation';

import { CreateMessageLink, EmptyDataWrapper, NotificationPageWrapper } from './styles';

const fields = {
  primary: 'title',
  secondary: ['from.name', 'from.surname'],
};

const NotificationsPage = () => {
  const { t } = useTranslation();
  const { id } = useAuthData();
  const { data = [], refetch } = useGetNotifications({ to: id });
  const updateNotificationMutation = useUpdateNotificationMutation();
  const { role } = useAuthData();
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null);

  const selectNotificationHandler = (data: unknown) => {
    const notification = data as INotification;
    setSelectedNotification(notification);
    updateNotificationMutation.mutateAsync({ ...notification, viewed: true })
      .then(() => void refetch());
  };

  return (
    <Page title={t('notifications')}>
      <PageTitle>{t('notifications')}</PageTitle>
      {!!data.length && (
        <NotificationPageWrapper>
          <List
            className="notifications-list"
            data={data}
            fields={fields}
            onSelect={selectNotificationHandler}
            highlite={['viewed', false]}
          />
          {selectedNotification !== null && (
            <NotificationContent>
              <NotificationTitle>{selectedNotification.title}</NotificationTitle>
              <div dangerouslySetInnerHTML={{ __html: selectedNotification.message }} />
            </NotificationContent>
          )}
        </NotificationPageWrapper>
      )}
      {!data.length && (
        <EmptyDataWrapper>
          {t('noData')}
        </EmptyDataWrapper>
      )}
      {role === 'admin' && (
        <CreateMessageLink to="/create-notification">
          <Button color="secondary"><EditIcon size={20} /></Button>
        </CreateMessageLink>
      )}
    </Page>
  );
};

export default NotificationsPage;
