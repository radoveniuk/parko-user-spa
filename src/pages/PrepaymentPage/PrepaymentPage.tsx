import React from 'react';
import { useTranslation } from 'react-i18next';

import Page, { PageTitle } from 'components/shared/Page';

import PrepaymentForm from './components/PrepaymentForm';
import PrepaymentsHistoryTable from './components/PrepaymentsHistoryTable';

const PrepaymentPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('prepaymentPage.title')}>
      <PageTitle>{t('prepaymentPage.title')}</PageTitle>
      <PrepaymentForm />
      <PrepaymentsHistoryTable />
    </Page>
  );
};

export default PrepaymentPage;
