import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IUser } from 'interfaces/users.interface';
import { IFile } from 'interfaces/file.interface';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import IconButton from 'components/shared/IconButton';
import { CloseIcon, DownloadFileIcon, EditIcon, UploadIcon } from 'components/icons';
import downloadFile from 'api/query/downloadFile';
import FileInput from 'components/shared/FileInput';
import Select from 'components/shared/Select';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { USER_SCAN_TYPE } from 'constants/selectsOptions';
import { uploadFiles } from 'api/common';
import Dialog from 'components/shared/Dialog';
import Button from 'components/shared/Button';
import { useDeleteFileMutation } from 'api/mutations/fileMutation';

import { DeleteModalContent, ScansWrapper } from './styles';

type Props = {
  data: IUser;
  onUpdate(v: Partial<IUser>): void;
};

const cols = [
  'file.name',
  '',
  '',
  '',
];

const Scans = ({ data, onUpdate }: Props) => {
  const { t } = useTranslation();
  const deleteFileMutation = useDeleteFileMutation();
  const scanKeys = Object.keys(data).filter((key) => key.includes('Scan')) as (keyof IUser)[];
  const availableScanTypes = scanKeys.filter((scanKey) => data[scanKey]);
  const translatedKeys = useTranslatedSelect(USER_SCAN_TYPE, 'user', false);
  const [selectedType, setSelectedType] = useState('');
  const [fileToDelete, setFileToDelete] = useState<IFile | null>(null);

  const updateFile = async (fileKey: string, file: File) => {
    const formData = new window.FormData();

    const ext = file.name.split('.')[file.name.split('.').length - 1];
    formData.append('files', file, `${fileKey}.${ext}`);

    const [uploadedFileData] = await uploadFiles(formData);
    onUpdate({ [fileKey]: uploadedFileData._id });
  };

  const deleteFile = () => {
    if (!fileToDelete) return;
    deleteFileMutation.mutateAsync(fileToDelete).then(() => {
      setFileToDelete(null);
      onUpdate({ [fileToDelete.originalname]: null });
    });
  };

  return (
    <ScansWrapper>
      <div className="upload-new-wrapper">
        <Select options={translatedKeys} label={t('user.scancopies')} onChange={(e) => void setSelectedType(e.target.value as string)} />
        <FileInput
          id="fileInput"
          disabled={!selectedType}
          onChange={(e: ChangeEvent<HTMLInputElement>) => { updateFile(selectedType, e.target.files?.[0] as File); }}
        >
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
                <ListTableCell><IconButton itemType="span" onClick={() => void setFileToDelete(fileData) }><CloseIcon /></IconButton></ListTableCell>
              </ListTableRow>
            );
          })}
        </ListTable>
      )}
      <Dialog
        open={!!fileToDelete}
        onClose={() => void setFileToDelete(null) }
        title={t('deleteApprove')}
      >
        <DeleteModalContent>
          <Button color="error" variant="outlined" onClick={deleteFile}>{t('true')}</Button>
          <Button color="primary" variant="outlined" onClick={() => void setFileToDelete(null) }>{t('false')}</Button>
        </DeleteModalContent>
      </Dialog>
    </ScansWrapper>
  );
};

export default Scans;
