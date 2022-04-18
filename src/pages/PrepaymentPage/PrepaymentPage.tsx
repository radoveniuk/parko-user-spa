import React from 'react';
import Page, { PageTitle } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';

const PrepaymentPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('prepaymentPage.title')}>
      <PageTitle>{t('prepaymentPage.title')}</PageTitle>
    </Page>
  );
};

export default PrepaymentPage;
