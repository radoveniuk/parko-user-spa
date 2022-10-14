import React from 'react';

import downloadFile from 'api/query/downloadFile';
import { FileIcon } from 'components/icons';
import { themeConfig } from 'theme';

import { FileWrapper } from './styles';

type Props = {
  name: string;
  fileId: string;
  ext?: string;
}

const FileItem = ({ fileId, name, ext }: Props) => {
  const fileClickHandler = () => {
    downloadFile(fileId, name, ext || 'pdf');
  };

  return (
    <FileWrapper onClick={fileClickHandler}>
      <div className="file-media">
        <FileIcon size={100} color={themeConfig.palette.primary.main} />
      </div>
      <div className="file-text">{name}{ext && <>.{ext}</>}</div>
    </FileWrapper>
  );
};

export default FileItem;
