import React from 'react';
import Dropzone from 'react-dropzone-uploader';
import { useTranslation } from 'react-i18next';

import { FileUploadAreaWrapper } from './styles';

import 'react-dropzone-uploader/dist/styles.css';

// type Props = {
//   accept?: string;
//   fileNameValidator?(name: string): boolean;
//   onUpload?(files: File[]): void
// }

// eslint-disable-next-line react/prop-types
const FileUploadArea = ({ accept, fileNameValidator, onUpload }) => {
  const { t } = useTranslation();

  const handleChangeStatus = (file, status) => {
    if (status === 'done') {
      if (fileNameValidator && !fileNameValidator(file.meta.name)) {
        file.remove();
      }
    }
  };

  const handleSubmit = (files, allFiles) => {
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
