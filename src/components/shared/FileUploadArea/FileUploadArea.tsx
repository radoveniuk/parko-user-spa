import React from 'react';
import Dropzone, { IFileWithMeta, StatusValue } from 'react-dropzone-uploader';

import 'react-dropzone-uploader/dist/styles.css';

type Props = {
  accept?: string;
  fileNameRegex?: RegExp;
  onUpload?(files: File[]): void
}

const FileUploadArea = ({ accept, fileNameRegex, onUpload }: Props) => {
  const handleChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (fileNameRegex && !fileNameRegex.test(file.meta.name)) {
        file.remove();
      }
    }
  };

  const handleSubmit = (files: IFileWithMeta[], allFiles: IFileWithMeta[]) => {
    onUpload?.(files.map(f => f.file));
    allFiles.forEach(f => f.remove());
  };

  return (
    <Dropzone
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      styles={{ dropzone: { minHeight: 200, maxHeight: 250 } }}
      accept={accept}
    />
  );
};

export default FileUploadArea;
