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
import { useDeleteFileMutation } from 'api/mutations/fileMutation';
import DialogConfirm from 'components/shared/DialogConfirm';
import Input from 'components/shared/Input';

import { ScansWrapper } from './styles';

type Props = {
  data: IUser;
  onUpdate(v: Partial<IUser>): void;
};

const cols = [
  'file.name',
  'file.ext',
  'file.type',
  'comment',
  '',
  '',
  '',
];

const Scans = ({ data, onUpdate }: Props) => {
  const { t } = useTranslation();
  const deleteFileMutation = useDeleteFileMutation();
  const scanKeys = Object.keys(data).filter((key) => key.includes('Scan') && !key.includes('other')) as (keyof IUser)[];
  const availableScanTypes = scanKeys.filter((scanKey) => data[scanKey]);
  const translatedKeys = useTranslatedSelect(USER_SCAN_TYPE, 'user', false, false);
  const [selectedType, setSelectedType] = useState('');
  const [fileToDelete, setFileToDelete] = useState<IFile | null>(null);
  const [comment, setComment] = useState('');

  const updateFile = async (fileKey: string, file: File, fileComment?: string) => {
    const formData = new window.FormData();

    formData.append('files', file);
    formData.append(file.name, JSON.stringify({ comment: fileComment, type: fileKey }));

    const [uploadedFileData] = await uploadFiles(formData);
    if (fileKey !== 'other') {
      onUpdate({ [fileKey]: uploadedFileData._id });
    } else {
      const oldOtherScans = (data.otherScans || []) as IFile[];
      onUpdate({
        otherScans: [
          ...oldOtherScans.map((item) => item._id),
          uploadedFileData._id,
        ],
      });
    }
  };

  const deleteFile = () => {
    if (!fileToDelete) return;
    deleteFileMutation.mutateAsync(fileToDelete).then(() => {
      if (fileToDelete.metadata?.type !== 'other') {
        onUpdate({ [fileToDelete.originalname]: null });
      } else {
        const oldOtherScans = (data.otherScans || []) as IFile[];
        const newOtherScans = oldOtherScans.filter((item) => item._id !== fileToDelete._id).map((item) => item._id);
        onUpdate({
          otherScans: newOtherScans,
        });
      }
      setFileToDelete(null);
    });
  };

  return (
    <ScansWrapper>
      <div className="upload-new-wrapper">
        <Select options={translatedKeys} label={t('user.scancopies')} onChange={(e) => void setSelectedType(e.target.value as string)} />
        <Input label={t('comment')} onChange={(e) => void setComment(e.target.value)} error={selectedType === 'other' && !comment} />
        <FileInput
          id="fileInput"
          disabled={!selectedType || (selectedType === 'other' && !comment)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => { updateFile(selectedType, e.target.files?.[0] as File, comment); }}
        >
          <UploadIcon />&nbsp;{t('user.upload')}
        </FileInput>
      </div>
      {(!!availableScanTypes.length || !!data.otherScans?.length) && (
        <ListTable columns={cols} className="file-grid">
          {availableScanTypes.map((scanKey) => {
            const fileData = data[scanKey] as IFile;
            return (
              <ListTableRow key={scanKey} className="file-row">
                <ListTableCell>{fileData.originalname}</ListTableCell>
                <ListTableCell>{fileData.ext}</ListTableCell>
                <ListTableCell>{t(`user.${scanKey}`)}</ListTableCell>
                <ListTableCell>{fileData.metadata?.comment}</ListTableCell>
                <ListTableCell>
                  <IconButton
                    onClick={() => void downloadFile(fileData._id, fileData.originalname, fileData.ext || 'pdf')}
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
          {data.otherScans?.map((scanItem) => {
            const fileData = scanItem as IFile;
            const comment = fileData.metadata?.comment as string;

            if (!fileData) return null;

            return (
              <ListTableRow key={fileData._id} className="file-row">
                <ListTableCell>{fileData.originalname}</ListTableCell>
                <ListTableCell>{fileData.ext}</ListTableCell>
                <ListTableCell>{t('other')}</ListTableCell>
                <ListTableCell>{comment}</ListTableCell>
                <ListTableCell>
                  <IconButton
                    onClick={() => void downloadFile(fileData._id, fileData.originalname, fileData.ext || 'pdf')}
                  >
                    <DownloadFileIcon />
                  </IconButton>
                </ListTableCell>
                <ListTableCell>
                  <FileInput
                    id={comment}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { updateFile('other', e.target.files?.[0] as File, comment); }}
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
      <DialogConfirm
        open={!!fileToDelete}
        onSubmit={deleteFile}
        onClose={() => void setFileToDelete(null) }
      />
    </ScansWrapper>
  );
};

export default Scans;
