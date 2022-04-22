import React from 'react';
import Page, { PageTitle } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';
import List from 'components/shared/List';

const NotificationsPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('notificationsPage.title')}>
      <PageTitle>{t('notificationsPage.title')}</PageTitle>
      <List />
    </Page>
  );
};

export default NotificationsPage;
