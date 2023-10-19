import React from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import Paychecks from 'components/complex/Paychecks';
import { useAuthData } from 'contexts/AuthContext';

const PaychecksPage = () => {
  const { t } = useTranslation();
  const { id } = useAuthData();
  useDocumentTitle(t('paychecks'));
  return (
    <Paychecks filter={{ user: id }} />
  );
};

export default PaychecksPage;
