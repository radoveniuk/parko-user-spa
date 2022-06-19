import React from 'react';
import Dropzone, { IFileWithMeta, StatusValue } from 'react-dropzone-uploader';
import { useTranslation } from 'react-i18next';

import 'react-dropzone-uploader/dist/styles.css';
import { FileUploadAreaWrapper } from './styles';

type Props = {
  accept?: string;
  fileNameValidator?(name: string): boolean;
  onUpload?(files: File[]): void
}

const FileUploadArea = ({ accept, fileNameValidator, onUpload }: Props) => {
  const { t } = useTranslation();

  const handleChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (fileNameValidator && !fileNameValidator(file.meta.name)) {
        file.remove();
      }
    }
  };

  const handleSubmit = (files: IFileWithMeta[], allFiles: IFileWithMeta[]) => {
    onUpload?.(files.map(f => f.file));
    allFiles.forEach(f => f.remove());
  };

  return (
    <FileUploadAreaWrapper>
      <Dropzone
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        accept={accept}
        inputContent={t('file.upload')}
        submitButtonContent={t('file.submit')}
        inputWithFilesContent={t('file.add')}
      />
    </FileUploadAreaWrapper>
  );
};

export default FileUploadArea;
