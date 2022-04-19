import React from 'react';
import Page, { PageTitle } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';
import PrepaymentForm from './components/PrepaymentForm';

const PrepaymentPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('prepaymentPage.title')}>
      <PageTitle>{t('prepaymentPage.title')}</PageTitle>
      <PrepaymentForm />
    </Page>
  );
};

export default PrepaymentPage;
