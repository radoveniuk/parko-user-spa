import React from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';

const DayoffListPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('dayoffList.title')}>
      <PageTitle>{t('dayoffList.title')}</PageTitle>
    </Page>
  );
};

export default DayoffListPage;
