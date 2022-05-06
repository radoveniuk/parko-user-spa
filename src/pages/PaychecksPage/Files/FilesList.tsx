import React, { ReactNode } from 'react';
import { FilesListWrapper } from './styles';

type Props = {
  children: ReactNode;
}

const FilesList = ({ children }: Props) => (
  <FilesListWrapper>
    {children}
  </FilesListWrapper>
);

export default FilesList;
