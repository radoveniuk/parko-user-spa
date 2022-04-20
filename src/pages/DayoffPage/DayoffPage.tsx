import React from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';
import DayoffRequestForm from './components/DayoffRequestForm';

const PrepaymentPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('dayoffPage.title')}>
      <PageTitle>{t('dayoffPage.title')}</PageTitle>
      <DayoffRequestForm />
    </Page>
  );
};

export default PrepaymentPage;
