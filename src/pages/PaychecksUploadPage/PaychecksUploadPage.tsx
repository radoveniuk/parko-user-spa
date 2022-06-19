import React from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';
import FileUploadArea from 'components/shared/FileUploadArea';
import { uploadFiles } from 'api/common';
import { IPaycheck } from 'interfaces/paycheck.interface';
import { useCreatePaychecksMutation } from 'api/mutations/paycheckMutation';
import { useSnackbar } from 'notistack';
import { DateTime } from 'luxon';
import { IFile } from 'interfaces/file.interface';
import { getUserListByParams } from 'api/query/userQuery';

const validateFileName = (str: string) => {
  const fileNameParams = str
    .replace('.pdf', '')
    .split('-')
    .join('')
    .split('_')
    .filter((item) => item);
  return fileNameParams.length === 4;
};

const PaychecksUploadPage = () => {
  const { t } = useTranslation();
  const createPaychecks = useCreatePaychecksMutation();
  const { enqueueSnackbar } = useSnackbar();

  const uploadPaychecks = async (files: File[]) => {
    const formData = new window.FormData();
    files.forEach((file) => {
      if (file) {
        formData.append('files', file);
      }
    });

    const uploadingResultList = await uploadFiles(formData);

    const getPaycheckData = async (fileData: IFile): Promise<Partial<IPaycheck>> => {
      const fileNameParams = fileData.originalname
        .replace('.pdf', '')
        .split('-')
        .join('')
        .split('_')
        .filter((item) => item);
      const [date, projectName, userName, userSurname] = fileNameParams;
      const [userData] = await getUserListByParams({ name: userName, surname: userSurname });
      return {
        linkedFile: fileData._id,
        date: DateTime.fromFormat(date, 'MM.yyyy').toISODate(),
        project: projectName,
        user: userData._id,
      };
    };

    const paychecks = await Promise.all(uploadingResultList.map(getPaycheckData));

    await createPaychecks.mutateAsync(paychecks);

    enqueueSnackbar(t('paycheck.successfullUpload'), { variant: 'success' });
  };

  return (
    <Page title={t('paychecksUpload')}>
      <PageTitle>{t('paychecksUpload')}</PageTitle>
      <FileUploadArea
        fileNameValidator={validateFileName}
        accept="application/pdf"
        onUpload={uploadPaychecks}
      />
    </Page>
  );
};

export default PaychecksUploadPage;
