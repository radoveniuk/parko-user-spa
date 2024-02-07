import React, { memo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash-es/isEmpty';
import omit from 'lodash-es/omit';
import { Button, Input } from 'v2/uikit';
import Dialog, { DialogActions } from 'v2/uikit/Dialog';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import FileInput from 'v2/uikit/FileInput';
import { FormCard, FormCardBody, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';
import Loader from 'v2/uikit/Loader';
import Select from 'v2/uikit/Select';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from 'v2/uikit/Table';

import { uploadFiles } from 'api/common';
import { useDeleteFileMutation, useUpdateFileMutation } from 'api/mutations/fileMutation';
import downloadFile from 'api/query/downloadFile';
import { DeleteIcon, EditIcon, FileIcon, PlusIcon, ScanIcon, UploadIcon } from 'components/icons';
import { USER_SCAN_TYPE } from 'constants/selectsOptions';
import { getDateFromIso } from 'helpers/datetime';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IFile } from 'interfaces/file.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

import { ActionsCell, FileInputArea, LoaderWrapper, ScanDialogContent } from './styles';

type Data = Pick<IUser,
'passScan' | 'otherScans' | 'idCardBackScan' | 'idCardFaceScan' | 'permitBackScan' | 'permitFaceScan' | 'internationalPassScan'>

type FormFields = {
  type: string;
  comment: string;
  file: File | IFile;
}

type Props = {
  data: Partial<Data>;
  onUpdate(v: Partial<Data>): void;
};

const DaysOffFormCard = ({ data, onUpdate }: Props) => {
  const { t } = useTranslation();
  const updateFileMutation = useUpdateFileMutation();
  const deleteFileMutation = useDeleteFileMutation();
  const translatedKeys = useTranslatedSelect(USER_SCAN_TYPE, 'user', false, false);
  const [fileToDelete, setFileToDelete] = useState<IFile | null>(null);
  const [scanDialogData, setScanDialogData] = useState<Partial<IFile> | null>(null);
  const [scanType, setScanType] = useState('');
  const [loading, setLoading] = useState(false);

  const [scans, setScans] = useState(data);
  const scanKeys = Object.keys(scans).filter((key) => key.includes('Scan') && !key.includes('other')) as (keyof Data)[];
  const availableScanTypes = scanKeys.filter((scanKey) => scans[scanKey]);

  const { reset, control, register, formState: { errors }, watch, setError, clearErrors, handleSubmit } = useForm<FormFields>();

  const updateFile = async (fileKey: string, file: File | IFile, fileComment?: string) => {
    let uploadedFileData: IFile | null = null;
    setLoading(true);
    if ((file as File).lastModified) {
      const f = file as File;
      const formData = new window.FormData();

      formData.append('files', f);
      formData.append(f.name, JSON.stringify({ comment: fileComment, type: fileKey }));

      const [fileData] = await uploadFiles(formData);
      uploadedFileData = fileData;
    } else {
      if (fileKey || fileComment) {
        uploadedFileData = { ...file as IFile, metadata: { ...(file as IFile).metadata, comment: fileComment || '', type: fileKey || '' } };
        await updateFileMutation.mutateAsync(uploadedFileData);
      } else {
        uploadedFileData = file as IFile;
      }
    }

    setLoading(false);
    reset();

    const oldOtherScans = (scans.otherScans || []) as IFile[];

    if (fileKey !== 'other') {
      setScans((prev) => {
        let newScans = { ...prev };
        if (scanDialogData?.metadata?.type && scanDialogData.metadata.type !== fileKey) {
          newScans = omit(newScans, scanDialogData.metadata.type);
        }
        return {
          ...newScans,
          [fileKey]: uploadedFileData,
          otherScans: oldOtherScans.filter((item) => item._id !== scanDialogData?._id),
        };
      });
      onUpdate({ [fileKey]: uploadedFileData._id });
    } else {
      setScans((prev) => ({
        ...prev,
        otherScans: [
          ...(prev.otherScans || []).filter((item) => item._id !== scanDialogData?._id),
          uploadedFileData,
        ],
      }));
      onUpdate({
        otherScans: [
          ...oldOtherScans.filter((item) => item._id !== scanDialogData?._id).map((item) => item._id),
          uploadedFileData._id,
        ],
      });
    }
    setScanDialogData(null);
  };

  const deleteFile = (file: IFile) => {
    setLoading(true);
    setFileToDelete(null);
    deleteFileMutation.mutateAsync(file).then(() => {
      if (file.metadata?.type !== 'other') {
        onUpdate({ [file.originalname]: null });
        setScans((prev) => omit(prev, file.metadata?.type as string));
      } else {
        const oldOtherScans = (scans.otherScans || []) as IFile[];
        const newOtherScans = oldOtherScans.filter((item) => item._id !== file._id).map((item) => item._id);
        onUpdate({
          otherScans: newOtherScans,
        });
        setScans((prev) => ({
          ...prev,
          otherScans: newOtherScans,
        }));
      }
      setLoading(false);
    });
  };

  const submitHandler:SubmitHandler<FormFields> = (values) => {
    updateFile(values.type, values.file, values.comment);
  };

  return (
    <>
      <FormCard>
        {loading && <LoaderWrapper><Loader /></LoaderWrapper>}
        <FormCardHeader icon={<ScanIcon size={24} />} title={t('user.scancopies')}>
          <Button onClick={() => { setScanDialogData({}); reset({ type: '', file: undefined, comment: '' }); }}><PlusIcon />{t('add')}</Button>
        </FormCardHeader>
        <FormCardBody>
          {(!!availableScanTypes.length || !!scans.otherScans?.length) && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('file.name')}</TableCell>
                    <TableCell>{t('file.type')}</TableCell>
                    <TableCell>{t('date')}</TableCell>
                    <TableCell>{t('comment')}</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableScanTypes.map((scanKey) => {
                    const fileData = scans[scanKey] as IFile;
                    return (
                      <TableRow key={scanKey}>
                        <TableCell
                        >
                          <a onClick={() => void downloadFile(fileData._id, fileData.originalname, fileData.ext || 'pdf')}>
                            {fileData.originalname}.{fileData.ext}
                          </a>
                        </TableCell>
                        <TableCell>{t(`user.${scanKey}`)}</TableCell>
                        <TableCell>{getDateFromIso(fileData.createdAt, 'dd.MM.yyyy HH:mm')}</TableCell>
                        <TableCell>{fileData.metadata?.comment}</TableCell>
                        <TableCell>
                          <ActionsCell>
                            <IconButton
                              onClick={() => {
                                setScanDialogData(fileData);
                                setScanType(scanKey);
                                reset({ type: scanKey, comment: fileData.metadata?.comment || '', file: fileData });
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => void setFileToDelete(fileData)}>
                              <DeleteIcon />
                            </IconButton>
                          </ActionsCell>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {scans.otherScans?.map((scanItem) => {
                    const fileData = scanItem as IFile;
                    const comment = fileData.metadata?.comment as string;

                    if (!fileData) return null;

                    return (
                      <TableRow key={fileData._id}>
                        <TableCell>
                          <a onClick={() => void downloadFile(fileData._id, fileData.originalname, fileData.ext || 'pdf')}>
                            {fileData.originalname}.{fileData.ext}
                          </a>
                        </TableCell>
                        <TableCell>{t('other')}</TableCell>
                        <TableCell>{getDateFromIso(fileData.createdAt, 'dd.MM.yyyy HH:mm')}</TableCell>
                        <TableCell>{comment}</TableCell>
                        <TableCell>
                          <ActionsCell>
                            <IconButton
                              onClick={() => {
                                setScanDialogData(fileData);
                                setScanType('other');
                                reset({ type: 'other', comment: fileData.metadata?.comment || '', file: fileData });
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => void setFileToDelete(fileData) }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ActionsCell>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </FormCardBody>
      </FormCard>
      <Dialog
        mobileFullscreen
        title={isEmpty(scanDialogData) ? t('user.addDoc') : t('edit')}
        onClose={() => void setScanDialogData(null)}
        open={scanDialogData !== null}
      >
        <ScanDialogContent>
          <div className="form">
            <Select
              options={translatedKeys}
              label={t('file.type')}
              error={!!errors.type}
              defaultValue={scanType}
              {...register('type', {
                required: true,
                onChange (event) {
                  if (event.target.value === 'other' && !watch('comment')) {
                    setError('comment', { type: 'required' });
                  } else {
                    clearErrors('comment');
                  }
                },
              })}
            />
            <Input
              label={t('comment')}
              error={!!errors.comment}
              {...register('comment', {
                onChange () {
                  clearErrors('comment');
                },
              })}
            />
            <Controller
              control={control}
              rules={{ required: true }}
              name="file"
              render={({ field, fieldState }) => (
                <FileInputArea className={fieldState.error ? 'error' : ''}>
                  {!field.value && (
                    <FileInput
                      multiple={false}
                      className="FileInput"
                      onChange={async (e) => {
                        if (e.target.files?.length) {
                          field.onChange(e.target.files[0]);
                        }
                      }}
                    >
                      {t('user.upload')}
                      <UploadIcon />
                    </FileInput>
                  )}
                  {(!!field.value && (field.value as File).lastModified) && (
                    <div className="file-link" title={(field.value as File).name}>
                      <div
                        role="button"
                        className="content"
                      >
                        <div className="name">
                          {(field.value as File).name}
                        </div>
                      </div>
                      <IconButton
                        className="delete-icon"
                        onClick={() => void field.onChange(null)}
                      >
                        <DeleteIcon color={themeConfig.palette.error.main} size={18} />
                      </IconButton>
                    </div>
                  )}
                  {(!!field.value && (field.value as IFile)._id) && (
                    <div className="file-link" title={`${(field.value as IFile).originalname}.${(field.value as IFile).ext}`}>
                      <div
                        role="button"
                        onClick={() => {
                          const file = field.value as IFile;
                          downloadFile(file._id, file.originalname, file.ext || 'pdf');
                        }}
                        className="content"
                      >
                        <div className="name">
                          {(field.value as IFile).originalname}.{(field.value as IFile).ext}
                        </div>
                        <FileIcon size={24} />
                      </div>
                      <IconButton
                        className="delete-icon"
                        onClick={() => void field.onChange(null)}
                      >
                        <DeleteIcon color={themeConfig.palette.error.main} size={18} />
                      </IconButton>
                    </div>
                  )}
                </FileInputArea>
              )}
            />
          </div>
          <DialogActions>
            <Button
              loading={loading}
              variant="contained"
              onClick={handleSubmit(submitHandler)}
            >
              {t('save')}
            </Button>
          </DialogActions>
        </ScanDialogContent>
      </Dialog>
      <DialogConfirm
        open={!!fileToDelete}
        onSubmit={() => void deleteFile(fileToDelete as IFile)}
        onClose={() => void setFileToDelete(null) }
      />
    </>
  );
};

export default memo(DaysOffFormCard);
