import React from 'react';
import { useTranslation } from 'react-i18next';

import Paychecks from 'components/complex/Paychecks';
import Page, { PageTitle } from 'components/shared/Page';
import { useAuthData } from 'contexts/AuthContext';

const PaychecksPage = () => {
  const { t } = useTranslation();
  const { id } = useAuthData();
  return (
    <Page title={t('paychecks')}>
      <PageTitle>{t('paychecks')}</PageTitle>
      <Paychecks filter={{ user: id }} />
    </Page>
  );
};

export default PaychecksPage;
