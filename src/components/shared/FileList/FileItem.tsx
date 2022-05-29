import React from 'react';
import { VscFilePdf } from 'react-icons/vsc';
import { themeConfig } from 'theme';
import downloadFile from 'api/query/downloadFile';
import { FileWrapper } from './styles';

type Props = {
  name: string;
  fileId: string;
}

const FileItem = ({ fileId, name }: Props) => {
  const fileClickHandler = () => {
    downloadFile(fileId, name);
  };

  return (
    <FileWrapper onClick={fileClickHandler}>
      <div className="file-media">
        <VscFilePdf size={100} color={themeConfig.palette.primary.main} />
      </div>
      <div className="file-text">{name}</div>
    </FileWrapper>
  );
};

export default FileItem;
