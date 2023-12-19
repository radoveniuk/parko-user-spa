import React, { memo, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash-es/isEqual';
import { DateTime } from 'luxon';
import { Button, Input } from 'v2/uikit';
import Dialog from 'v2/uikit/Dialog';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import FileInput from 'v2/uikit/FileInput';
import { FormCard, FormCardBody, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';
import LoaderCircular from 'v2/uikit/LoaderCircular';
import Select from 'v2/uikit/Select';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from 'v2/uikit/Table';

import { uploadFiles } from 'api/common';
import downloadFile from 'api/query/downloadFile';
import { DeleteIcon, EditIcon, FileIcon, PaycheckIcon, PlusIcon, UploadIcon } from 'components/icons';
import createId from 'helpers/createId';
import { getDateFromIso } from 'helpers/datetime';
import { isMongoId } from 'helpers/regex';
import useListState from 'hooks/useListState';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IFile } from 'interfaces/file.interface';
import { IPaycheck } from 'interfaces/paycheck.interface';
import { themeConfig } from 'theme';

import DateFormat from './components/DateFormat';
import { ActionsCell, FileInputArea, FinanceDialogContent } from './styles';

const defaultDateRegex = /((0[1-9]|1[0-2])\/[12]\d{3})/;
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

const DEFAULT_VALUES: Finance = {
  type: 'invoice',
  data: {
    _id: '',
    user: '',
    project: '',
    date: '',
    linkedFile: '',
  },
};

type Finance = {
  type: 'invoice' | 'paytoll';
  data: IPaycheck;
};

type Props = {
  data: Finance[];
  onDeletePaycheck?(id: string): void;
  onUpdatePaycheck?(data: Partial<IPaycheck>): void;
  onCreatePaycheck?(data: Partial<IPaycheck>): void;
};

const FinancesFormCard = ({ data, onCreatePaycheck, onDeletePaycheck, onUpdatePaycheck }: Props) => {
  const { t } = useTranslation();

  const financeTypeList = useTranslatedSelect(['invoice', 'payroll'], 'financeType');

  const [financeDialogData, setFinanceDialogData] = useState<Partial<Finance> | null>(null);
  const [deleteDialogData, setDeleteDialogData] = useState<Partial<Finance> | null>(null);

  const { register, control, formState: { errors }, getValues, reset, handleSubmit } = useForm<Finance>();

  const [finances, { add, remove, update }, setFinances] = useListState(data);

  const createPaycheckHandler = () => {
    const values = getValues();
    onCreatePaycheck?.(values.data);
    add({
      ...values,
      data: {
        ...values.data,
        _id: createId(),
        createdAt: DateTime.now().toISO(),
        date: DateTime.fromFormat(values.data.date, 'MM/yyyy').toISODate(),
      },
    });
  };

  const updatePaycheckHandler = () => {
    if (financeDialogData?.data?._id) {
      const values = getValues();
      const date = isoDateRegex.test(values.data.date) ? values.data.date : DateTime.fromFormat(values.data.date, 'MM/yyyy').toISODate();
      onUpdatePaycheck?.({
        ...financeDialogData.data,
        ...values.data,
        date,
      });
      update(financeDialogData as Finance, {
        ...values,
        data: {
          ...values.data,
          date,
        },
      });
    }
  };

  const removePaycheckHandler = () => {
    if (deleteDialogData && deleteDialogData?.data?._id) {
      onDeletePaycheck?.(deleteDialogData.data._id);
      remove(deleteDialogData as Finance);
    }
  };

  const submitHandler: SubmitHandler<Finance> = () => {
    if (financeDialogData) {
      if (financeDialogData?.data?._id) {
        updatePaycheckHandler();
      } else {
        createPaycheckHandler();
      }
      setFinanceDialogData(null);
    }
  };

  useEffect(() => {
    if (!isEqual(data, finances)) {
      setFinances(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setFinances]);

  const [fileUploading, setFileUploading] = useState(false);

  return (
    <>
      <FormCard>
        <FormCardHeader icon={<PaycheckIcon size={24} />} title={t('user.finances')}>
          <Button onClick={() => { setFinanceDialogData({}); reset(DEFAULT_VALUES); }}><PlusIcon />{t('add')}</Button>
        </FormCardHeader>
        <FormCardBody>
          {!!finances.length && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('finance.type')}</TableCell>
                    <TableCell>{t('finance.period')}</TableCell>
                    <TableCell>{t('finance.comment')}</TableCell>
                    <TableCell>{t('finance.createdAt')}</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {finances.map((finance) => (
                    <TableRow key={finance.data._id}>
                      <TableCell>
                        <a
                          onClick={() => {
                            const file = finance.data.linkedFile as IFile;
                            downloadFile(file._id, file.originalname, file.ext || 'pdf');
                          }}
                        >
                          {t(`selects.financeType.${finance.type}`)}
                        </a>
                      </TableCell>
                      <TableCell>{getDateFromIso(finance.data.date, 'MM/yyyy')}</TableCell>
                      <TableCell>{finance.data.comment}</TableCell>
                      <TableCell>{getDateFromIso(finance.data.createdAt, 'dd.MM.yyyy HH:mm')}</TableCell>
                      <TableCell align="right">
                        <ActionsCell>
                          <IconButton disabled={!isMongoId(finance.data._id)} onClick={() => { setFinanceDialogData(finance); reset(finance); }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton disabled={!isMongoId(finance.data._id)} onClick={() => void setDeleteDialogData(finance)}>
                            <DeleteIcon />
                          </IconButton>
                        </ActionsCell>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </FormCardBody>
      </FormCard>
      <Dialog
        mobileFullscreen
        title={financeDialogData?.data?._id ? t('finance.edit') : t('finance.add')}
        onClose={() => void setFinanceDialogData(null)}
        open={financeDialogData !== null}
      >
        <FinanceDialogContent>
          <div className="form">
            <Select
              label={`${t('finance.type')}*`}
              error={!!errors.type}
              options={financeTypeList}
              defaultValue={financeDialogData?.type || 'invoice'}
              {...register('type', { required: true })}
            />
            <Input
              label={`${t('paycheck.date')}*`}
              placeholder="MM/YYYY"
              InputProps={{ inputComponent: DateFormat as any }}
              error={!!errors.data?.date}
              defaultValue={getDateFromIso(financeDialogData?.data?.date, 'MM/yyyy') || ''}
              {...register('data.date', {
                required: true,
                validate: (value) => isoDateRegex.test(value) || defaultDateRegex.test(value),
              })}
            />
            <Controller
              control={control}
              rules={{ required: true }}
              name="data.linkedFile"
              render={({ field, fieldState }) => (
                <FileInputArea className={fieldState.error ? 'error' : ''}>
                  {!field.value && (
                    <FileInput
                      disabled={fileUploading}
                      multiple={false}
                      className="FileInput"
                      onChange={async (e) => {
                        if (e.target.files?.length) {
                          const formData = new window.FormData();
                          formData.append('files', e.target.files[0]);
                          setFileUploading(true);
                          const [uploadedFileData] = await uploadFiles(formData);
                          setFileUploading(false);
                          field.onChange(uploadedFileData);
                        }
                      }}
                    >
                      {t('user.upload')}
                      {!fileUploading && <UploadIcon size={24} />}
                      {fileUploading && <LoaderCircular size={24} />}
                    </FileInput>
                  )}
                  {(!!field.value && typeof field.value === 'object') && (
                    <div className="file-link" title={`${field.value.originalname}.${field.value.ext}`}>
                      <div
                        role="button"
                        onClick={() => {
                          const file = field.value as IFile;
                          downloadFile(file._id, file.originalname, file.ext || 'pdf');
                        }}
                        className="content"
                      >
                        <div className="name">
                          {field.value.originalname}.{field.value.ext}
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
            <Input
              label={t('finance.comment')}
              defaultValue={financeDialogData?.data?.comment || ''}
              multiline
              className="comment"
              {...register('data.comment')}
            />
          </div>
          <div className="actions">
            <Button
              variant="contained"
              onClick={handleSubmit(submitHandler)}
            >
              {t('save')}
            </Button>
          </div>
        </FinanceDialogContent>
      </Dialog>
      <DialogConfirm
        open={deleteDialogData !== null}
        onSubmit={() => {
          removePaycheckHandler();
          setDeleteDialogData(null);
        }}
        onClose={() => void setDeleteDialogData(null)}
      />
    </>
  );
};

export default memo(FinancesFormCard);
