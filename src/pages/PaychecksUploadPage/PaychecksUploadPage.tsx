import React from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';
import FileUploadArea from 'components/shared/FileUploadArea';
import { uploadFiles } from 'api/common';
import { IPaycheck } from 'interfaces/paycheck.interface';
import { useCreatePaychecksMutation } from 'api/mutations/paycheckMutation';
import { useSnackbar } from 'notistack';
import { DateTime } from 'luxon';

const PaychecksUploadPage = () => {
  const { t } = useTranslation();
  const createPaychecks = useCreatePaychecksMutation();
  const { enqueueSnackbar } = useSnackbar();

  const uploadPaychecks = (files: File[]) => {
    const formData = new window.FormData();

    files.forEach((file) => {
      if (file) {
        formData.append('files', file);
      }
    });

    uploadFiles(formData).then((resultList) => {
      const paychecks: Partial<IPaycheck>[] = resultList.map(({ originalname, _id }) => ({
        linkedFile: _id,
        date: DateTime.now().toISODate(),
        project: 'project1',
        userId: '6288dd2f7601caac4d874cec',
      }));
      createPaychecks.mutate(paychecks);
      enqueueSnackbar(t('paychecksUpload.success'), { variant: 'success' });
    });
  };

  return (
    <Page title={t('paychecksUpload.title')}>
      <PageTitle>{t('paychecksUpload.title')}</PageTitle>
      <FileUploadArea fileNameRegex={/^[0-9]{2}[.][0-9]{4}.pdf$/g} accept="application/pdf" onUpload={uploadPaychecks} />
    </Page>
  );
};

export default PaychecksUploadPage;
