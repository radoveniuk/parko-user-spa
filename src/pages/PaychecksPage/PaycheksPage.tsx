import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { useGetPaycheckList } from 'api/query/paycheckQuery';
import { File, Files } from 'components/shared/FileList';
import Page, { PageTitle } from 'components/shared/Page';
import { useAuthData } from 'contexts/AuthContext';
import { IFile } from 'interfaces/file.interface';

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
            fileId={(prepayment.linkedFile as IFile)._id}
          />
        ))}
      </Files>
    </Page>
  );
};

export default PaychecksPage;
