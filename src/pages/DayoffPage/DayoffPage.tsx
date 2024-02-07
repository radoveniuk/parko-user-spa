import React from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import DayoffHistory from './components/DayoffHistory';
import DayoffRequestForm from './components/DayoffRequestForm';

const PrepaymentPage = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('dayoffPage.title'));
  return (
    <>
      <DayoffRequestForm />
      <DayoffHistory />
    </>
  );
};

export default PrepaymentPage;
