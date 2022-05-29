import React from 'react';
import Page, { PageTitle } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';
import { useGetPaycheckList } from 'api/query/paycheckQuery';
import { useAuthData } from 'contexts/AuthContext';
import { DateTime } from 'luxon';
import { File, Files } from 'components/shared/FileList';

const PaychecksPage = () => {
  const { t } = useTranslation();
  const { id } = useAuthData();
  const { data } = useGetPaycheckList({ user: id });
  return (
    <Page title={t('paychecks')}>
      <PageTitle>{t('paychecks')}</PageTitle>
      <Files>
        {data?.map((prepayment) => (
          <File
            key={prepayment._id}
            name={DateTime.fromISO(prepayment.date).toFormat('MM.yyyy')}
            fileId={prepayment.linkedFile}
          />
        ))}
      </Files>
    </Page>
  );
};

export default PaychecksPage;
