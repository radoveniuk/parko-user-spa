import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { IUser } from 'interfaces/users.interface';
import { IFile } from 'interfaces/file.interface';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import IconButton from 'components/shared/IconButton';
import { CloseIcon, DownloadFileIcon, EditIcon, UploadIcon } from 'components/icons';
import downloadFile from 'api/query/downloadFile';
import FileInput from 'components/shared/FileInput';

import { ScansWrapper } from './styles';
import Select from 'components/shared/Select';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

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
  const availableScanTypes = scanKeys.filter((scanKey) => data[scanKey]);
  const translatedKeys = useTranslatedSelect(scanKeys, 'user', false);

  const updateFile = (fileKey: string, file: File) => {
    console.log(fileKey, file, 'update');
  };

  const deleteFile = (fileKey: string) => {
    console.log(fileKey, 'delete');
  };

  return (
    <ScansWrapper>
      <div className="upload-new-wrapper">
        <Select options={translatedKeys} label={t('user.scancopies')} />
        <FileInput id="fileInput" disabled>
          <UploadIcon />&nbsp;{t('user.upload')}
        </FileInput>
      </div>
      {!!availableScanTypes.length && (
        <ListTable columns={cols} className="file-grid">
          {availableScanTypes.map((scanKey) => {
            const fileData = data[scanKey] as IFile;
            return (
              <ListTableRow key={scanKey} className="file-row">
                <ListTableCell>{t(`user.${scanKey}`)}{fileData.ext && <>.{fileData.ext}</>}</ListTableCell>
                <ListTableCell>
                  <IconButton
                    onClick={() => void downloadFile(fileData._id, t(`user.${scanKey}`), fileData.ext || 'pdf')}
                  >
                    <DownloadFileIcon />
                  </IconButton>
                </ListTableCell>
                <ListTableCell>
                  <FileInput
                    id={scanKey}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { updateFile(scanKey, e.target.files?.[0] as File); }}
                    buttonComponent={(
                      <IconButton
                        className="file-input"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  />
                </ListTableCell>
                <ListTableCell><IconButton itemType="span" onClick={() => void deleteFile(scanKey) }><CloseIcon /></IconButton></ListTableCell>
              </ListTableRow>
            );
          })}
        </ListTable>
      )}
    </ScansWrapper>
  );
};

export default Scans;
