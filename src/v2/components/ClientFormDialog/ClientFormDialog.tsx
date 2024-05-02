import React, { memo, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import Autocomplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import PhoneInput, { checkPhoneNumber } from 'v2/uikit/PhoneInput';
import Select from 'v2/uikit/Select';

import { useGetUserList } from 'api/query/userQuery';
import { CLIENT_STATUS } from 'constants/selectsOptions';
import { validateEmail } from 'helpers/validateEmail';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IClient } from 'interfaces/client.interface';
import { IUser } from 'interfaces/users.interface';

import { FormWrapper } from './styles';

type Data = Partial<IClient>;

export type ClientFormDialogProps = DialogProps & {
  data?: Data;
  onSave?(values: Data): void;
}

const ClientFormDialog = ({ data, title, onSave, ...rest }: ClientFormDialogProps) => {
  const { t } = useTranslation();
  const statuses = useTranslatedSelect(CLIENT_STATUS, 'clientStatus', true, false);
  const { data: managers = [], isFetching: isManagersFetching } = useGetUserList({ permissions: 'users:update' });

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<Data>({ defaultValues: data });

  const submitHamdler: SubmitHandler<Data> = (values) => {
    // const recruiter = recruiters.find((item) => item._id === values.recruiter);
    onSave?.({ ...values, managers: values.managers?.map(item => (item as IUser)._id) || [] });
  };

  useEffect(() => {
    if (rest.open) {
      reset(data || {});
    }
  }, [data, reset, rest.open]);

  return (
    <Dialog mobileFullscreen title={title || t('profile')} {...rest}>
      <FormWrapper>
        <Controller
          control={control}
          name="managers"
          render={({ field }) => (
            <Autocomplete
              defaultValue={data && data.managers ? data.managers : []}
              multiple
              valueKey="_id"
              options={managers}
              loading={isManagersFetching}
              label={t('client.managers')}
              getOptionLabel={(option) => `${option.name} ${option.surname}`}
              onChange={field.onChange}
              disableCloseOnSelect
              limitTags={2}
              theme="gray"
              className="fullwidth"
            />
          )}
        />
        <Input label={`${t('client.company')}*`} error={!!errors.name} theme="gray" {...register('name', { required: true })} />
        <Input label={t('client.shortName')} theme="gray" {...register('shortName')} />
        <Input label={t('client.ICO')} theme="gray" {...register('ICO')} />
        <Input label={t('client.DIC')} theme="gray" {...register('DIC')} />
        <Input label={t('client.ICDPH')} theme="gray" {...register('ICDPH')} />
        <Input label={t('client.sidlo')} theme="gray" {...register('sidlo')} />
        <Input label={t('client.websiteUrl')} theme="gray" {...register('websiteUrl')} />
        <Input label={t('client.contactPerson')} theme="gray" {...register('contactPerson')} />
        <Input label={t('client.contactPersonPosition')} theme="gray" {...register('contactPersonPosition')} />
        <Input label={t('Email')} theme="gray" {...register('email', { validate: (v) => !v || validateEmail(v) })} />
        <Controller
          control={control}
          name="phone"
          defaultValue=""
          rules={{ validate: (value) => !value || checkPhoneNumber(value) }}
          render={({ field }) => (
            <PhoneInput
              value={field.value as string}
              onChange={field.onChange}
              label={t('client.phone')}
              error={!!errors.phone}
              theme="gray"
            />
          )}
        />
        <Select label={t('client.status')} options={statuses} defaultValue={data?.status} theme="gray" {...register('status')} />
        <Controller
          control={control}
          name="cooperationStartDate"
          render={({ field }) => (
            <DatePicker
              defaultValue={field.value}
              onChange={field.onChange}
              label={t('client.cooperationStartDate')}
              inputProps={{ theme: 'gray' }}
            />
          )}
        />
        <Controller
          control={control}
          name="cooperationEndDate"
          render={({ field }) => (
            <DatePicker
              defaultValue={field.value}
              onChange={field.onChange}
              label={t('client.cooperationEndDate')}
              inputProps={{ theme: 'gray' }}
            />
          )}
        />
        <Input
          label={t('comment')}
          theme="gray"
          className="fullwidth"
          {...register('comment')}
        />
      </FormWrapper>
      <DialogActions>
        <Button onClick={handleSubmit(submitHamdler)} variant="contained">{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(ClientFormDialog);
