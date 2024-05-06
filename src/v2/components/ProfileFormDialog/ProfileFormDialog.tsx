import React, { memo, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { COUNTRIES } from 'v2/constants/countries';
import { USER_WORK_TYPES } from 'v2/constants/userWorkTypes';
import { Button, Input } from 'v2/uikit';
import Autocomplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import PhoneInput, { checkPhoneNumber } from 'v2/uikit/PhoneInput';
import Select from 'v2/uikit/Select';

import { useGetDictionary } from 'api/query/dictionariesQuery';
import { useGetRoles } from 'api/query/roleQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { WarningIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IRole } from 'interfaces/role.interface';
import { IUser, UserWorkType } from 'interfaces/users.interface';

import AddressSearchInput from '../AddressSearchInput/AddressSearchInput';

import { CountrySelectOption, FormWrapper, NamesakesDialogContent } from './styles';

type Data = Pick<IUser, 'name' | 'surname' | 'email' | 'birthDate' | 'country' | 'sex' |
'adress' | 'source' | 'recruiter' | 'phone' | 'notes' | 'workTypes' | 'roles'>

export type ProfileFormDialogProps = DialogProps & {
  data?: Partial<Data>;
  onSave?(values: Data): void;
}

const ProfileFormDialog = ({ data, title, onSave, ...rest }: ProfileFormDialogProps) => {
  const { permissions } = useAuthData();
  const { t } = useTranslation();
  const sexOptions = useTranslatedSelect(['male', 'female']);
  const translatedWorkTypes = useTranslatedSelect(USER_WORK_TYPES, 'userWorkType');
  const { data: sourceDictionary } = useGetDictionary('PROFILE_SOURCE');
  const { data: recruiters = [] } = useGetUserListForFilter({ permissions: 'users:update' });

  // roles
  const { data: roles = [] } = useGetRoles();
  const rolesToIds = (roles: IRole[]) => roles?.map(role => (role as unknown as IRole)._id);
  const idsToRoles = (ids: string[]) => ids?.map(roleId => roles.find(role => role._id === roleId));

  const {
    register, control, handleSubmit,
    formState: { errors }, reset, getValues, watch,
  } = useForm<Data>({ defaultValues: { ...data, roles: rolesToIds(data?.roles || []) } });

  const queryClient = useQueryClient();

  const [showNamesakesDialog, setShowNamesakesDialog] = useState(false);

  const processName = (name: string): string => {
    const processedName = name.replace(/\b\s+-\s+\b/g, '-').replace(/\s+/g, ' ').trim();
    return processedName;
  };

  const saveProfile = () => {
    setShowNamesakesDialog(false);
    const values = getValues();
    const recruiter = recruiters.find((item) => item._id === values.recruiter) as { fullname: string; _id: string };
    onSave?.({
      ...values,
      recruiter: recruiter || null,
      name: processName(values.name),
      surname: processName(values.surname),
      roles: idsToRoles(values.roles || data?.roles || []),
    });
  };

  const submitHamdler: SubmitHandler<Data> = async (values) => {
    if (!data) {
      const allUsers = queryClient.getQueryData(['users-filter', '{}']) as IUser[];
      const isNamesakes = allUsers.some((user) => user.name.trim().toLowerCase() === values.name.trim().toLowerCase() &&
       user.surname.trim().toLowerCase() === values.surname.trim().toLowerCase());
      if (isNamesakes) {
        setShowNamesakesDialog(true);
      } else {
        saveProfile();
      }
    } else {
      saveProfile();
    }
  };

  useEffect(() => {
    if (rest.open) {
      reset({ ...data, roles: rolesToIds(data?.roles || []) } || {});
    }
  }, [data, reset, rest.open]);

  return (
    <>
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
            rules={{ validate: (value) => !value || checkPhoneNumber(value as string) }}
            render={({ field }) => (
              <PhoneInput
                theme="gray"
                value={field.value as string}
                onChange={field.onChange}
                label={t('project.phone')}
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
          <Controller
            name="adress"
            control={control}
            rules={{
              validate: (address: string) => {
                // eslint-disable-next-line no-useless-escape, max-len
                const pattern = /^[\w\u00C0-\u00ff\u0100-\u017F\u0180-\u024F\s',.-]+ \d+(\/\d+[a-zA-Z]?)?, \d{5} [\w\u00C0-\u00ff\u0100-\u017F\u0180-\u024F\s',.-]+$/;
                return address ? pattern.test(address) || t('errorTexts.addressFormat') : true;
              },
            }}
            render={({ field, fieldState }) => (
              <AddressSearchInput
                country={COUNTRIES.find(country => country.value === watch('country'))?.code}
                label={t('user.adress')}
                theme="gray"
                value={field.value}
                onChange={field.onChange}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                tooltip={t('errorTexts.addressFormat')}
              />
            )}
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
            labelPath={(item) => `${item.fullname}, ${item?.roles?.map((r: IRole) => r.name).join(',')}`}
            {...register('recruiter')}
          />
          {permissions.includes('roles:update') && roles.length && (
            <Controller
              control={control}
              name="roles"
              render={({ field }) => (
                <Autocomplete
                  value={roles.filter((role) => field.value?.includes(role._id))}
                  theme="gray"
                  options={roles}
                  valueKey="_id"
                  labelKey="name"
                  label={t('user.role')}
                  limitTags={1}
                  onChange={(values) => void field.onChange(values.map((item: IRole) => item._id))}
                  disableCloseOnSelect
                  multiple
                />
              )}
            />
          )}
          <Controller
            control={control}
            name="workTypes"
            render={({ field }) => (
              <Autocomplete
                defaultValue={data && data.workTypes
                  ? translatedWorkTypes.filter((translatedItem) => data.workTypes?.includes(translatedItem.value as UserWorkType))
                  : []
                }
                value={translatedWorkTypes.filter((translatedItem) => field.value?.includes(translatedItem.value as UserWorkType))}
                theme="gray"
                options={translatedWorkTypes}
                valueKey="value"
                labelKey="label"
                label={t('user.workTypes')}
                limitTags={1}
                onChange={(values) => void field.onChange(values.map((item: { value: string }) => item.value))}
                disableCloseOnSelect
                multiple
              />
            )}
          />
          <Input
            label={t('user.notes')}
            theme="gray"
            {...register('notes')}
          />
        </FormWrapper>
        <DialogActions>
          <Button onClick={handleSubmit(submitHamdler)} variant="contained">{t('save')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog color="rgb(237, 108, 2)" title={t('areYouSure')} open={showNamesakesDialog} onClose={() => void setShowNamesakesDialog(false)}>
        <NamesakesDialogContent>
          <WarningIcon size={36} />
          <div>{t('user.thisNameExistsMsg')}</div>
        </NamesakesDialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => void setShowNamesakesDialog(false)}>{t('cancel')}</Button>
          <Button variant="contained" onClick={() => void saveProfile()}>{t('continue')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(ProfileFormDialog);
