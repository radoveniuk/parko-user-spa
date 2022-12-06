import React from 'react';
import { useTranslation } from 'react-i18next';

import Page, { PageTitle } from 'components/shared/Page';

const ClientListPage = () => {
  const { t } = useTranslation();

  return (
    <Page title={t('navbar.clients')}>
      <PageTitle>{t('navbar.clients')}</PageTitle>
    </Page>
  );
};

export default ClientListPage;
