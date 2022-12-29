import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash-es';

import { useCreateResidence, useUpdateResidence } from 'api/mutations/residenceMutation';
import { useGetAccommodations } from 'api/query/accommodationQuery';
import { useGetUserList } from 'api/query/userQuery';
import Autocomplete from 'components/shared/Autocomplete';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import DatePicker from 'components/shared/DatePicker';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IResidence } from 'interfaces/residence.interface';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  data?: IResidence
};

const ResidenceDialog = ({ data, onClose, ...rest }:Props) => {
  const { t } = useTranslation();
  const { formState: { errors }, control, handleSubmit } = useForm<IResidence>({
    defaultValues: {
      _id: data?._id,
      checkInDate: data?.checkInDate,
      checkOutDate: data?.checkOutDate,
      accommodation: (data?.accommodation as IAccommodation)?._id,
    },
  });
  const { data: accommodations = [] } = useGetAccommodations();
  const { data: users = [] } = useGetUserList({ role: 'user' });
  const [notificateOwner, setNotificateOwner] = useState<boolean>(!data?.checkOutDate);
  const createResidence = useCreateResidence();
  const updateResidence = useUpdateResidence();

  const submitHandler: SubmitHandler<IResidence> = (v) => {
    const values: IResidence = { ...v, checkInDate: v.checkInDate || null, checkOutDate: v.checkOutDate || null };

    const mutation = values._id ? updateResidence : createResidence;
    mutation.mutateAsync({ data: values, notificate: notificateOwner }).then(() => { onClose(); });
  };

  return (
    <Dialog
      title={`Check in ${data?.checkOutDate ? '- Check out' : ''}`}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          {!!users.length && (
            <Controller
              control={control}
              name="user"
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  options={users}
                  label={`${t('navbar.profiles')}*`}
                  getOptionLabel={(option) => `${option.name} ${option.surname} ${option.project ? `(${option.project.name})` : ''}`}
                  className="form-field"
                  defaultValue={data?.user || null}
                  onChange={(v) => void field.onChange(v?._id || '')}
                  error={!!errors.user}
                />
              )}
            />
          )}
          {!!accommodations.length && (
            <Controller
              control={control}
              name="accommodation"
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  options={accommodations}
                  label={`${t('navbar.accommodation')}*`}
                  getOptionLabel={(option) => `${option.adress} (${option.owner})`}
                  className="form-field"
                  defaultValue={data?.accommodation || null}
                  onChange={(v) => void field.onChange(v?._id || '')}
                  error={!!errors.accommodation}
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
                value={field.value}
                onChange={field.onChange}
                label={`${t('accommodation.checkIn')}*`}
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
                  value={field.value}
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
            title={t('accommodation.notificate')}
          />
          <Button onClick={handleSubmit(submitHandler)} disabled={!isEmpty(errors)}>{t('approve')}</Button>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default ResidenceDialog;
