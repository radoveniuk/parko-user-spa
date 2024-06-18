import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { isEmpty } from 'lodash-es';
import isEqual from 'lodash-es/isEqual';
import isObject from 'lodash-es/isObject';
import { Button, Input } from 'v2/uikit';
import Autocomplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import FileInput from 'v2/uikit/FileInput';
import IconButton from 'v2/uikit/IconButton';
import LoaderCircular from 'v2/uikit/LoaderCircular';
import Select from 'v2/uikit/Select';
import { Tab, TabPanel, Tabs, TabsContainer } from 'v2/uikit/Tabs';

import { uploadFiles } from 'api/common';
import { useDeleteFileMutation } from 'api/mutations/fileMutation';
import downloadFile from 'api/query/downloadFile';
import { DeleteIcon, UploadIcon } from 'components/icons';
import { REASONS } from 'constants/dayoffReasons';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IUser } from 'interfaces/users.interface';

import { FileInputArea, PrepaymentDialogContent } from './styles';

type Props = DialogProps & {
  onSave(values: IDayOff): void;
  data?: IDayOff
};

const DayoffDialog = ({ onSave, data, ...rest }: Props) => {
  const { t } = useTranslation();
  const translatedReasons = useTranslatedSelect(REASONS, 'dayoffReason', true, false);
  const { control, register, formState: { errors }, handleSubmit } = useForm<IDayOff>();
  const queryClient = useQueryClient();
  const users: IUser[] = queryClient.getQueryData(['users-filter', JSON.stringify({})]) || [];

  const submitHandler: SubmitHandler<IDayOff> = (values) => {
    onSave({ ...values, user: isObject(values.user) ? (values.user as IUser)?._id : values.user });
  };

  const [fileUploading, setFileUploading] = useState(false);
  const deleteFileMutation = useDeleteFileMutation();

  return (
    <Dialog
      mobileFullscreen
      title={t('dayoff.dayoff')}
      {...rest}
    >
      <TabsContainer>
        <PrepaymentDialogContent>
          <Tabs orientation="horizontal">
            <Tab className={`tab-btn ${!isEmpty(errors) ? ' error' : ''}`} label={t('dayoff.data')} />
            <Tab className="tab-btn" label={t('dayoff.docs')} />
          </Tabs>
          <TabPanel index={0} className="form">
            <Controller
              control={control}
              name="user"
              defaultValue={data?.user}
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  theme="gray"
                  options={users}
                  label={`${t('prepayment.user')}*`}
                  getOptionLabel={(option) => `${option.fullname} ${option.project ? `(${option.project.name})` : ''}`}
                  defaultValue={data?.user || null}
                  onChange={(v) => void field.onChange(v?._id || '')}
                  error={!!errors.user}
                />
              )}
            />
            <Select
              label={t('dayoff.reason')}
              error={!!errors.reason}
              options={translatedReasons}
              defaultValue={data?.reason || ''}
              theme="gray"
              {...register('reason')}
            />
            <Controller
              control={control}
              name="dateStart"
              defaultValue={data?.dateStart || ''}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker
                  defaultValue={field.value}
                  onChange={field.onChange}
                  label={`${t('dayoff.dateStart')}*`}
                  error={!!errors.dateStart}
                  inputProps={{ theme: 'gray' }}
                  views={['day']}
                />
              )}
            />
            <Controller
              control={control}
              name="dateEnd"
              defaultValue={data?.dateEnd || ''}
              render={({ field }) => (
                <DatePicker
                  defaultValue={field.value}
                  onChange={field.onChange}
                  label={t('dayoff.dateEnd')}
                  error={!!errors.dateEnd}
                  inputProps={{ theme: 'gray' }}
                  views={['day']}
                />
              )}
            />
            <Input
              label={t('dayoff.adminComment')}
              defaultValue={data?.adminComment || ''}
              theme="gray"
              className="fullwidth"
              {...register('adminComment')}
            />
          </TabPanel>
          <TabPanel index={1} className="files">
            <Controller
              control={control}
              name="docs"
              defaultValue={data?.docs || []}
              render={({ field, fieldState }) => (
                <>
                  <ul className="files-list">
                    {field.value?.map((file) => {
                      if (typeof file === 'object') {
                        return (
                          <li key={file._id} title={file.originalname}>
                            <span onClick={() => void downloadFile(file._id, file.originalname, file.ext)}>
                              {file.originalname}.{file.ext}
                            </span>
                            <IconButton
                              onClick={() => {
                                deleteFileMutation.mutate(file);
                                field.onChange(field.value?.filter((fItem) => !isEqual(fItem, file)));
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                  <FileInputArea className={fieldState.error ? 'error' : ''}>
                    <FileInput
                      disabled={fileUploading}
                      className="FileInput"
                      multiple
                      onChange={async (e) => {
                        if (e.target.files?.length) {
                          const formData = new window.FormData();
                          Array.from(e.target.files).forEach((fItem) => {
                            formData.append('files', fItem);
                          });
                          setFileUploading(true);
                          const uploadedFilesData = await uploadFiles(formData);
                          setFileUploading(false);
                          field.onChange([...(field.value || []), ...uploadedFilesData]);
                        }
                      }}
                    >
                      {t('user.upload')}
                      {!fileUploading && <UploadIcon size={24} />}
                      {fileUploading && <LoaderCircular size={24} />}
                    </FileInput>
                  </FileInputArea>
                </>
              )}
            />
          </TabPanel>
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleSubmit(submitHandler)}
            >
              {t('save')}
            </Button>
          </DialogActions>
        </PrepaymentDialogContent>
      </TabsContainer>
    </Dialog>
  );
};

export default DayoffDialog;
