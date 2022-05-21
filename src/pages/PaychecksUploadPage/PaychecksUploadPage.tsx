import React from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';

const PaychecksUploadPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('paychecksUpload.title')}>
      <PageTitle>{t('paychecksUpload.title')}</PageTitle>
    </Page>
  );
};

export default PaychecksUploadPage;
