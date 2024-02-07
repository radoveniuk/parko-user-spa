import React from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import PrepaymentForm from './components/PrepaymentForm';
import PrepaymentsHistoryTable from './components/PrepaymentsHistoryTable';

const PrepaymentPage = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('prepaymentPage.title'));
  return (
    <>
      <PrepaymentForm />
      <PrepaymentsHistoryTable />
    </>
  );
};

export default PrepaymentPage;
