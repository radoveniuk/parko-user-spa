import React from 'react';
import Page, { PageTitle } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';

const PaychecksPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('paychecksPage.title')}>
      <PageTitle>{t('paychecksPage.title')}</PageTitle>
    </Page>
  );
};

export default PaychecksPage;
