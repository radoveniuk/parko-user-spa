import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { uploadFiles } from 'api/common';
import { useCreatePaychecksMutation } from 'api/mutations/paycheckMutation';
import { getUserListByParams } from 'api/query/userQuery';
import FileUploadArea from 'components/shared/FileUploadArea';
import { IFile } from 'interfaces/file.interface';
import { IPaycheck } from 'interfaces/paycheck.interface';

import { UploadAreaWrapper } from './styles';

const getParamsFromName = (str: string) => {
  const whitespace = str.includes('_') ? '_' : ' ';
  return str
    .replace('.pdf', '')
    .split('-')
    .join('')
    .split(whitespace)
    .filter((item) => item);
};

const validateFileName = (str: string) => getParamsFromName(str).length === 4;

const UploadArea = () => {
  const { t } = useTranslation();
  const createPaychecks = useCreatePaychecksMutation();

  const uploadPaychecks = async (files: File[]) => {
    const formData = new window.FormData();
    files.forEach((file) => {
      if (file) {
        formData.append('files', file);
      }
    });

    const uploadingResultList = await uploadFiles(formData);

    const getPaycheckData = async (fileData: IFile): Promise<Partial<IPaycheck>> => {
      const [date, projectName, userName, userSurname] = getParamsFromName(fileData.originalname);
      const [userData] = await getUserListByParams({ name: userName, surname: userSurname });
      return {
        linkedFile: fileData._id,
        date: DateTime.fromFormat(date, 'MM.yyyy').toISODate(),
        project: projectName,
        user: userData._id,
      };
    };

    const paychecks = await Promise.all(uploadingResultList.map(getPaycheckData));
    createPaychecks.mutate(paychecks);
  };
  return (
    <UploadAreaWrapper>
      <p className="validation-message">{t('paycheck.message')}</p>
      <FileUploadArea
        fileNameValidator={validateFileName}
        accept="application/pdf"
        onUpload={uploadPaychecks}
      />
    </UploadAreaWrapper>
  );
};

export default UploadArea;
