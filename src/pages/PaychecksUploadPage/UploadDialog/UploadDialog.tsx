/* eslint-disable no-unused-vars */
import React, { ChangeEvent, forwardRef, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PatternFormat, PatternFormatProps } from 'react-number-format';
import { isEmpty } from 'lodash-es';
import { DateTime } from 'luxon';
import Autocomplete from 'v2/uikit/Autocomplete';
import Input from 'v2/uikit/Input';

import { uploadFiles } from 'api/common';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { FileIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Dialog, { DialogActions, DialogProps } from 'components/shared/Dialog';
import FileInput from 'components/shared/FileInput';
import { getDateFromIso } from 'helpers/datetime';
import { IPaycheck } from 'interfaces/paycheck.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { UploadPaycheckFormWrapper } from './styles';

const dateRegex = /((0[1-9]|1[0-2])\.[12]\d{3})/;

interface NumberFormatProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const DateFormat = forwardRef<PatternFormatProps<string>, NumberFormatProps>(
  function NumberFormatCustom (props, ref) {
    const { onChange, ...other } = props;

    return (
      <PatternFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.formattedValue,
            },
          });
        }}
        format="##.####"
        mask="_"
      />
    );
  },
);

type Props = DialogProps & {
  submit(values: IPaycheck): void;
};

const TemplateDialog = ({ onClose, submit, ...rest }: Props) => {
  const { t } = useTranslation();
  const { handleSubmit, formState: { errors }, control, setError, clearErrors, setValue } = useForm<IPaycheck>();

  const { data: users = [] } = useGetUserListForFilter();

  const [dateValue, setDateValue] = useState<string>('');
  const [file, setFile] = useState<null | File>(null);

  const submitHandler: SubmitHandler<IPaycheck> = async (values) => {
    if (!file) return;
    const formData = new window.FormData();
    formData.append('files', file);
    const [uploadedFileData] = await uploadFiles(formData);

    const project = users.find((item) => item._id === values.user)?.project as IProject;
    submit({
      ...values,
      project: project.name,
      linkedFile: uploadedFileData._id,
    });
  };

  // date validation
  useEffect(() => {
    const isValid = dateRegex.test(dateValue);
    if (!isValid) setError('date', { type: 'required' });
    if (isValid) {
      clearErrors('date');
      setValue('date', DateTime.fromFormat(dateValue, 'MM.yyyy').toISODate());
    };
  }, [clearErrors, dateValue, setError, setValue]);

  // file validation
  useEffect(() => {
    if (!file) setError('linkedFile', { type: 'required' });
    if (file) {
      clearErrors('linkedFile');
    };
  }, [clearErrors, file, setError, setValue]);

  return (
    <Dialog
      title={t('paycheck.paycheck')}
      onClose={onClose}
      maxWidth={false}
      {...rest}
    >
      <UploadPaycheckFormWrapper>
        <Input
          label={`${t('paycheck.date')}*`}
          value={dateValue}
          onChange={(e) => {
            setDateValue(e.target.value);
          }}
          placeholder="MM.YYYY"
          InputProps={{ inputComponent: DateFormat as any }}
          error={!!errors.date}
        />
        <Controller
          control={control}
          name="user"
          rules={{ required: true }}
          render={({ field }) => (
            <Autocomplete
              options={users}
              label={`${t('paycheck.user')}*`}
              getOptionLabel={(option) => `${option.name} ${option.surname} ${option.project ? `(${option.project.name})` : ''}`}
              onChange={(v) => void field.onChange(v?._id || '')}
              error={!!errors.user}
            />
          )}
        />
        <FileInput
          onChange={(e: ChangeEvent<HTMLInputElement>) => void setFile(e.target.files?.[0] || null)}
        >
          <FileIcon size={20} />
          {t('paycheck.upload')}
        </FileInput>
        <DialogActions>
          <Button
            onClick={handleSubmit(submitHandler)}
            disabled={!isEmpty(errors)}
          >
            {t('save')}
          </Button>
        </DialogActions>
      </UploadPaycheckFormWrapper>
    </Dialog>
  );
};

export default TemplateDialog;
