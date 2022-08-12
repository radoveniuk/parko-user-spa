import React from 'react';
import { useTranslation } from 'react-i18next';

import { IUser } from 'interfaces/users.interface';
import { IFile } from 'interfaces/file.interface';

import { ScansWrapper } from './styles';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import IconButton from 'components/shared/IconButton';
import { CloseIcon, DownloadFileIcon, EditIcon } from 'components/icons';
import downloadFile from 'api/query/downloadFile';

type Props = {
  data: IUser;
};

const cols = [
  'file.name',
  '',
  '',
  '',
];

const Scans = ({ data }: Props) => {
  const { t } = useTranslation();
  const scanKeys = Object.keys(data).filter((key) => key.includes('Scan')) as (keyof IUser)[];
  return (
    <ScansWrapper>
      <ListTable columns={cols} className="file-grid">
        {scanKeys.filter((scanKey) => data[scanKey]).map((scanKey) => {
          const fileData = data[scanKey] as IFile;
          return (
            <ListTableRow key={scanKey}>
              <ListTableCell>{t(`user.${scanKey}`)}{fileData.ext && <>.{fileData.ext}</>}</ListTableCell>
              <ListTableCell>
                <IconButton
                  onClick={() => void downloadFile(fileData._id, t(`user.${scanKey}`), fileData.ext || 'pdf')}
                >
                  <DownloadFileIcon />
                </IconButton>
              </ListTableCell>
              <ListTableCell><IconButton><EditIcon /></IconButton></ListTableCell>
              <ListTableCell><IconButton><CloseIcon /></IconButton></ListTableCell>
            </ListTableRow>
          );
        })}
      </ListTable>
    </ScansWrapper>
  );
};

export default Scans;
