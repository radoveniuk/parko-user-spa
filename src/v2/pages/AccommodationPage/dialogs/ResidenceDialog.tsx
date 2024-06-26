import React, { useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash-es';
import Autocomplete from 'v2/uikit/Autocomplete2';
import Button from 'v2/uikit/Button';
import Checkbox from 'v2/uikit/Checkbox';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';

import { useCreateResidence, useUpdateResidence } from 'api/mutations/residenceMutation';
import { useGetAccommodations } from 'api/query/accommodationQuery';
import { useGetEmployments } from 'api/query/employmentQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  data?: IResidence
};

const ResidenceDialog = ({ data, onClose, ...rest }:Props) => {
  const { t } = useTranslation();
  const { formState: { errors }, control, handleSubmit, setValue } = useForm<IResidence>({
    defaultValues: {
      _id: data?._id,
      checkInDate: data?.checkInDate,
      checkOutDate: data?.checkOutDate,
      accommodation: (data?.accommodation as IAccommodation)?._id,
      employment: data?.employment,
      user: (data?.user as IUser)?._id,
    },
  });
  const { data: accommodations = [] } = useGetAccommodations();
  const { data: users = [], isFetching, isLoading } = useGetUserListForFilter();

  const { data: employments = [] } = useGetEmployments();

  const selectedUser = useWatch({ control, name: 'user' });
  const userEmployments = useMemo(() => employments.filter((e) => (e.user as IUser)?._id === selectedUser), [employments, selectedUser]);

  const [notificateOwner, setNotificateOwner] = useState<boolean>(!data?.checkOutDate);
  const createResidence = useCreateResidence();
  const updateResidence = useUpdateResidence();

  const submitHandler: SubmitHandler<IResidence> = (v) => {
    const values: IResidence = { ...v, checkInDate: v.checkInDate || null, checkOutDate: v.checkOutDate || null };

    const mutation = values._id ? updateResidence : createResidence;
    mutation.mutateAsync({ data: values, notificate: notificateOwner }).then(onClose);
  };

  return (
    <Dialog
      mobileFullscreen
      title={`Check in ${data?.checkOutDate ? '- Check out' : ''}`}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Controller
            control={control}
            name="user"
            rules={{
              required: true,
              onChange () {
                setValue('employment', undefined);
              },
            }}
            render={({ field }) => (
              <Autocomplete
                loading={isFetching || isLoading}
                theme="gray"
                options={users}
                label={t('navbar.profiles')}
                getOptionLabel={(option) => option.fullname}
                className="form-field"
                value={users.find(user => user._id === field.value)}
                onChange={(v) => void field.onChange(v?._id || '')}
                error={!!errors.user}
                disabled={!users.length}
                required
              />
            )}
          />
          {!!userEmployments.length && (
            <Controller
              control={control}
              name="employment"
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  loading={isFetching || isLoading}
                  theme="gray"
                  options={userEmployments}
                  label={t('user.employment')}
                  getOptionLabel={(option) => `${option.project.client.shortName} > ${option.project.name}`}
                  className="form-field"
                  value={userEmployments.find(employment => employment._id === field.value)}
                  onChange={(v) => void field.onChange(v?._id || '')}
                  error={!!errors.employment}
                  disabled={!userEmployments.length}
                  required
                />
              )}
            />
          )}
          {!!accommodations.length && (
            <Controller
              control={control}
              name="accommodation"
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  theme="gray"
                  options={accommodations}
                  label={t('navbar.accommodation')}
                  getOptionLabel={(option) => option.name || option.adress}
                  className="form-field"
                  value={accommodations.find(accommodation => accommodation._id === field.value)}
                  onChange={(v) => void field.onChange(v?._id || '')}
                  error={!!errors.accommodation}
                  required
                />
              )}
            />
          )}
          <Controller
            control={control}
            name="checkInDate"
            defaultValue={null}
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                inputProps={{ theme: 'gray', required: true }}
                defaultValue={field.value}
                onChange={field.onChange}
                label={t('accommodation.checkIn')}
                className="form-field"
                error={!!errors.checkInDate}
              />
            )}
          />
          {data?.checkOutDate && (
            <Controller
              control={control}
              name="checkOutDate"
              defaultValue={null}
              render={({ field }) => (
                <DatePicker
                  inputProps={{ theme: 'gray' }}
                  defaultValue={field.value}
                  onChange={field.onChange}
                  label={t('accommodation.checkOut')}
                  className="form-field"
                />
              )}
            />
          )}
        </div>
        <div className="actions">
          <Checkbox
            checked={notificateOwner}
            onChange={(e) => void setNotificateOwner(e.target.checked)}
            label={t('accommodation.notificate')}
          />
          <Button variant="contained" onClick={handleSubmit(submitHandler)} disabled={!isEmpty(errors)}>{t('approve')}</Button>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default ResidenceDialog;
