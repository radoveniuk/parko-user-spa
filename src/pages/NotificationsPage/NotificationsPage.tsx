import React from 'react';
import Page, { PageTitle } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';
import List from 'components/shared/List';
import { INotification } from 'interfaces/notification.interface';

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
    title: 'Yasya created prepayment request',
    message: '50 euro',
    entityType: 'prepayment',
    linkedDoc: '11',
    viewed: false,
  },
  {
    id: '3',
    from: 'system',
    to: 'admin',
    title: 'Miron created prepayment request',
    message: '50 euro',
    entityType: 'prepayment',
    linkedDoc: '11',
    viewed: false,
  },
];

const fields = {
  primary: 'title',
  secondary: 'from',
};

const NotificationsPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('notificationsPage.title')}>
      <PageTitle>{t('notificationsPage.title')}</PageTitle>
      <List data={notifications} fields={fields} />
    </Page>
  );
};

export default NotificationsPage;
