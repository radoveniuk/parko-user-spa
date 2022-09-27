import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash-es';

import { useGetAccommodations } from 'api/query/accommodationQuery';
import Button from 'components/shared/Button';
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

const ResidenceDialog = ({ data, ...rest }:Props) => {
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

  const submitHandler: SubmitHandler<IResidence> = (values) => {
    console.log(values);
  };

  return (
    <Dialog title={`Check in - Check out ${selectedUser ? `(${selectedUser.name} ${selectedUser.surname})` : ''}`} {...rest}>
      <DialogContentWrapper>
        <div className="form">
          <Search<IUser>
            url="/users"
            placeholder={t('navbar.profiles')}
            searchItemComponent={(user) => `${user.name} ${user.surname} ${user.project ? `(${(user.project as IProject).name})` : ''}`}
            onSelectItem={(user) => void setSelectedUser(user)}
          />
          <Select
            label={t('navbar.accommodation')}
            error={!!errors.accommodation}
            options={accommodations}
            valuePath="_id"
            labelPath={['adress', 'owner']}
            className="form-field"
            value={accommodations.length ? (data?.accommodation as IAccommodation)?._id : ''}
            {...register('accommodation', { required: true })}
          />
          <Controller
            control={control}
            name="checkInDate"
            defaultValue={null}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                label={t('project.dateStart')}
              />
            )}
          />
          <Controller
            control={control}
            name="checkOutDate"
            defaultValue={null}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                label={t('project.dateStart')}
              />
            )}
          />
        </div>
        <div className="actions">
          <Button onClick={handleSubmit(submitHandler)} disabled={!isEmpty(errors)}>{t('OK')}</Button>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default ResidenceDialog;
