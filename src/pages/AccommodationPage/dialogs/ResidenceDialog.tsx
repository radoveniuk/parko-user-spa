import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash-es';

import { useCreateResidence, useUpdateResidence } from 'api/mutations/residenceMutation';
import { useGetAccommodations } from 'api/query/accommodationQuery';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import DatePicker from 'components/shared/DatePicker';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import Search from 'components/shared/Search';
import Select from 'components/shared/Select';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IProject } from 'interfaces/project.interface';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  data?: IResidence
};

const ResidenceDialog = ({ data, onClose, ...rest }:Props) => {
  const { t } = useTranslation();
  const { register, formState: { errors }, control, handleSubmit } = useForm<IResidence>({
    defaultValues: {
      _id: data?._id,
      checkInDate: data?.checkInDate,
      checkOutDate: data?.checkOutDate,
      accommodation: (data?.accommodation as IAccommodation)?._id,
    },
  });
  const { data: accommodations = [] } = useGetAccommodations();
  const [selectedUser, setSelectedUser] = useState<IUser | undefined>(data?.user as IUser);
  const createResidence = useCreateResidence();
  const updateResidence = useUpdateResidence();

  const submitHandler: SubmitHandler<IResidence> = (v) => {
    if (!selectedUser) return;
    const values = { ...v, user: selectedUser._id };

    const mutation = values._id ? updateResidence : createResidence;
    mutation.mutateAsync(values).then(() => { onClose(); });
  };

  return (
    <Dialog
      title={`Check in ${data?.checkOutDate ? '- Check out' : ''} ${selectedUser ? `(${selectedUser.name} ${selectedUser.surname})` : ''}`}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Search<IUser>
            url="/users"
            placeholder={t('navbar.profiles')}
            searchItemComponent={(user) => `${user.name} ${user.surname} ${user.project ? `(${(user.project as IProject).name})` : ''}`}
            onSelectItem={(user) => void setSelectedUser(user)}
          />
          {accommodations.length && (
            <Select
              label={t('navbar.accommodation')}
              error={!!errors.accommodation}
              options={accommodations}
              valuePath="_id"
              labelPath={['adress', 'owner']}
              className="form-field"
              defaultValue={(data?.accommodation as IAccommodation)?._id || ''}
              {...register('accommodation', { required: true })}
            />
          )}
          <Controller
            control={control}
            name="checkInDate"
            defaultValue={null}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                label={t('accommodation.checkIn')}
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
                />
              )}
            />
          )}
        </div>
        <div className="actions">
          <Checkbox defaultChecked={!data?.checkOutDate} title={t('accommodation.notificate')} />
          <Button onClick={handleSubmit(submitHandler)} disabled={!isEmpty(errors) || !selectedUser}>{t('OK')}</Button>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default ResidenceDialog;
