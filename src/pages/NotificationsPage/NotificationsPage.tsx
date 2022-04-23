import React, { useState } from 'react';
import Page, { PageTitle } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';
import List from 'components/shared/List';
import { INotification } from 'interfaces/notification.interface';
import { NotificationPageWrapper } from './styles';
import { NotificationContent, NotificationText, NotificationTitle } from './NotificationContent';

const notifications: INotification[] = [
  {
    id: '1',
    from: 'system',
    to: 'admin',
    title: 'Bohdan created prepayment request',
    message: '50 euro',
    entityType: 'prepayment',
    linkedDoc: '11',
    viewed: false,
  },
  {
    id: '2',
    from: 'system',
    to: 'admin',
    title: 'Yasya send dayoff message',
    // eslint-disable-next-line max-len
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis id porttitor dolor iaculis sit aliquam, nullam. Vulputate non leo mauris scelerisque netus ultrices. Felis, at sed sed neque, maecenas. Suspendisse iaculis id sed turpis. Imperdiet blandit sodales placerat eget velit, tincidunt. Vitae elementum vitae dignissim felis, ornare duis. Quam sollicitudin eleifend mattis a id neque ullamcorper arcu. Proin iaculis donec fames sed sit nam id eu nulla. A risus dui tortor augue enim sit sed hac mauris.',
    entityType: 'prepayment',
    linkedDoc: '11',
    viewed: false,
  },
  {
    id: '3',
    from: 'system',
    to: 'admin',
    title: 'Miron created prepayment request',
    message: '88 euro',
    entityType: 'prepayment',
    linkedDoc: '11',
    viewed: true,
  },
];

const fields = {
  primary: 'title',
  secondary: 'from',
};

const NotificationsPage = () => {
  const { t } = useTranslation();
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null);
  return (
    <Page title={t('notificationsPage.title')}>
      <PageTitle>{t('notificationsPage.title')}</PageTitle>
      <NotificationPageWrapper>
        <List
          className="notifications-list"
          data={notifications}
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
    </Page>
  );
};

export default NotificationsPage;
