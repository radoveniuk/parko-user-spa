import React from 'react';
import Page, { PageTitle } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';

const PrepaymentPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('dayoffPage.title')}>
      <PageTitle>{t('dayoffPage.title')}</PageTitle>
    </Page>
  );
};

export default PrepaymentPage;
