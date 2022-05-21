import React from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';

const PrepaymentsListPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('prepaymentsList.title')}>
      <PageTitle>{t('prepaymentsList.title')}</PageTitle>
    </Page>
  );
};

export default PrepaymentsListPage;
