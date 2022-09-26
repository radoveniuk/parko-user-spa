import React from 'react';
import { useTranslation } from 'react-i18next';

import UploadedPaychecks from 'components/complex/UploadedPaychecks';
import Page, { PageTitle } from 'components/shared/Page';
import { useAuthData } from 'contexts/AuthContext';

const PaychecksPage = () => {
  const { t } = useTranslation();
  const { id } = useAuthData();
  return (
    <Page title={t('paychecks')}>
      <PageTitle>{t('paychecks')}</PageTitle>
      <UploadedPaychecks filter={{ user: id }} />
    </Page>
  );
};

export default PaychecksPage;
