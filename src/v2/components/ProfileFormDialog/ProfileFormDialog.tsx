import React, { memo, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { COUNTRIES } from 'v2/constants/countries';
import { Button, Input } from 'v2/uikit';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import PhoneInput, { checkPhoneNumber } from 'v2/uikit/PhoneInput';
import Select from 'v2/uikit/Select';

import { useGetDictionary } from 'api/query/dictionariesQuery';
import { useGetUserList } from 'api/query/userQuery';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IUser } from 'interfaces/users.interface';

import { CountrySelectOption, FormWrapper } from './styles';

type Data = Pick<IUser, 'name' | 'surname' | 'email' | 'birthDate' | 'country' | 'sex' | 'adress' | 'source' | 'recruiter' | 'phone'>

export type ProfileFormDialogProps = DialogProps & {
  data?: Data;
  onSave?(values: Data): void;
}

const ProfileFormDialog = ({ data, title, onSave, ...rest }: ProfileFormDialogProps) => {
  const { t } = useTranslation();
  const sexOptions = useTranslatedSelect(['male', 'female']);
  const { data: sourceDictionary } = useGetDictionary('PROFILE_SOURCE');
  const { data: recruiters = [] } = useGetUserList({ role: 'recruiter' });

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<Data>({ defaultValues: data });

  const submitHamdler: SubmitHandler<Data> = (values) => {
    const recruiter = recruiters.find((item) => item._id === values.recruiter);
    onSave?.({ ...values, recruiter: recruiter || null });
  };

  useEffect(() => {
    if (rest.open) {
      reset(data || {});
    }
  }, [data, reset, rest.open]);

  return (
    <Dialog mobileFullscreen title={title || t('profile')} {...rest}>
      <FormWrapper>
        <Input
          label={`${t('user.name')}*`}
          theme="gray"
          error={!!errors.name}
          {...register('name', { required: true })}
        />
        <Input
          label={`${t('user.surname')}*`}
          theme="gray"
          error={!!errors.name}
          {...register('surname', { required: true })}
        />
        <Input
          type="email"
          label={t('user.email')}
          theme="gray"
          {...register('email')}
        />
        <Controller
          control={control}
          name="phone"
          defaultValue={data?.phone || ''}
          rules={{ validate: (value) => !value || checkPhoneNumber(value as string), required: true }}
          render={({ field }) => (
            <PhoneInput
              theme="gray"
              value={field.value as string}
              onChange={field.onChange}
              label={`${t('project.phone')}*`}
              error={!!errors.phone}
            />
          )}
        />
        <Controller
          control={control}
          name="birthDate"
          render={({ field }) => (
            <DatePicker
              inputProps={{ theme: 'gray' }}
              defaultValue={field.value}
              onChange={field.onChange}
              label={t('user.birthDate')}
              error={!!errors.birthDate}
              onBlur={field.onBlur}
            />
          )}
        />
        <Select
          theme="gray"
          options={sexOptions}
          label={t('user.sex')}
          defaultValue={data?.sex}
          {...register('sex')}
        />
        <Select
          theme="gray"
          options={COUNTRIES}
          labelPath={(data) => (
            <CountrySelectOption><img src={`https://flagcdn.com/w20/${data.code}.png`} className="mr-12" />{data.value}</CountrySelectOption>
          )}
          label={t('user.country')}
          defaultValue={data?.country}
          {...register('country')}
        />
        <Input
          label={t('user.adress')}
          theme="gray"
          {...register('adress')}
        />
        <Select
          theme="gray"
          label={t('user.source')}
          defaultValue={data?.source}
          options={sourceDictionary?.options}
          labelPath="label"
          {...register('source')}
        />
        <Select
          theme="gray"
          label={t('user.recruiter')}
          defaultValue={data?.recruiter}
          options={recruiters}
          valuePath="_id"
          labelPath={['name', 'surname']}
          {...register('recruiter')}
        />
      </FormWrapper>
      <DialogActions>
        <Button onClick={handleSubmit(submitHamdler)} variant="contained">{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(ProfileFormDialog);