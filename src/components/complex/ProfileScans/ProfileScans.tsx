import React, { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import IconButton from 'v2/uikit/IconButton';
import Input from 'v2/uikit/Input';
import Select from 'v2/uikit/Select';

import { uploadFiles } from 'api/common';
import { useDeleteFileMutation } from 'api/mutations/fileMutation';
import { useUpdateUserMutation } from 'api/mutations/userMutation';
import downloadFile from 'api/query/downloadFile';
import { useGetUser } from 'api/query/userQuery';
import { CloseIcon, DownloadFileIcon, EditIcon, UploadIcon } from 'components/icons';
import DialogConfirm from 'components/shared/DialogConfirm';
import FileInput from 'components/shared/FileInput';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { USER_SCAN_TYPE } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IFile } from 'interfaces/file.interface';
import { IUser } from 'interfaces/users.interface';

import { ScansWrapper } from './styles';

type Props = {
  id: string;
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

const ProfileScans = ({ id }: Props) => {
  const cachedData = useQueryClient().getQueryData(['user-data', id]);
  const { data, refetch } = useGetUser(id, { enabled: !cachedData });
  const deleteFileMutation = useDeleteFileMutation();
  const updateUserMutation = useUpdateUserMutation();

  const { t } = useTranslation();

  const translatedKeys = useTranslatedSelect(USER_SCAN_TYPE, 'user', false, false);
  const [selectedType, setSelectedType] = useState('');
  const [fileToDelete, setFileToDelete] = useState<IFile | null>(null);
  const [comment, setComment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateHandler = async (values: Partial<IUser>) => {
    updateUserMutation.mutateAsync({ ...values, _id: id })
      .then(() => {
        refetch();
      });
  };

  const updateFile = async (fileKey: string, file: File, fileComment?: string) => {
    if (!data) return null;
    const formData = new window.FormData();

    formData.append('files', file);
    formData.append(file.name, JSON.stringify({ comment: fileComment, type: fileKey }));

    const [uploadedFileData] = await uploadFiles(formData);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setComment('');

    if (fileKey !== 'other') {
      updateHandler({ [fileKey]: uploadedFileData._id });
    } else {
      const oldOtherScans = (data.otherScans || []) as IFile[];
      updateHandler({
        otherScans: [
          ...oldOtherScans.map((item) => item._id),
          uploadedFileData._id,
        ],
      });
    }
  };

  const deleteFile = async (file: IFile) => {
    if (!data) return null;
    await deleteFileMutation.mutateAsync(file);
    if (file.metadata?.type !== 'other') {
      await updateHandler({ [file.originalname]: null });
    } else {
      const oldOtherScans = (data.otherScans || []) as IFile[];
      const newOtherScans = oldOtherScans.filter((item) => item._id !== file._id).map((item) => item._id);
      await updateHandler({
        otherScans: newOtherScans,
      });
    }
    setFileToDelete(null);
  };

  if (!data) return null;

  const scanKeys = Object.keys(data).filter((key) => key.includes('Scan') && !key.includes('other')) as (keyof IUser)[];
  const availableScanTypes = scanKeys.filter((scanKey) => data[scanKey]);

  return (
    <ScansWrapper>
      <div className="upload-new-wrapper">
        <Select
          options={translatedKeys}
          label={t('user.scancopies')}
          onChange={(e) => void setSelectedType(e.target.value as string)}
          className="settings-input"
        />
        <Input
          label={t('comment')}
          value={comment}
          onChange={(e) => void setComment(e.target.value)}
          error={selectedType === 'other' && !comment}
          className="settings-input"
        />
      </div>
      <div className="file-input-wrapper">
        <FileInput
          id="fileInput"
          disabled={!selectedType || (selectedType === 'other' && !comment)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => { updateFile(selectedType, e.target.files?.[0] as File, comment); }}
          ref={fileInputRef}
        >
          <UploadIcon />&nbsp;{t('user.upload')}
        </FileInput>
      </div>
      {(!!availableScanTypes.length || !!data.otherScans?.length) && (
        <ListTable columns={cols} className="file-grid">
          {availableScanTypes.map((scanKey) => {
            const fileData = data[scanKey] as IFile;
            return (
              <ListTableRow key={scanKey}>
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
                      <div className="file-input">
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </div>
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
              <ListTableRow key={fileData._id}>
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      deleteFile(fileData).then(() => {
                        updateFile('other', e.target.files?.[0] as File, comment);
                      });
                    }}
                    buttonComponent={(
                      <div className="file-input">
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </div>
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
        onSubmit={() => void deleteFile(fileToDelete as IFile)}
        onClose={() => void setFileToDelete(null) }
      />
    </ScansWrapper>
  );
};

export default ProfileScans;
