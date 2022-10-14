import React from 'react';
import { useTranslation } from 'react-i18next';

import Page, { PageTitle } from 'components/shared/Page';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <Page title="404">
      <PageTitle>{t('notFoundText')}</PageTitle>
    </Page>
  );
};

export default NotFoundPage;
