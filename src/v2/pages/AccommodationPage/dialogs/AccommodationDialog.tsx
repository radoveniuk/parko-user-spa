import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash-es';
import Button from 'v2/uikit/Button';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';
import Input from 'v2/uikit/Input';
import PhoneInput, { checkPhoneNumber } from 'v2/uikit/PhoneInput';
import Select from 'v2/uikit/Select';

import { useCreateAccommodation, useUpdateAccommodation } from 'api/mutations/accommodationMutation';
import { ACCOMMODATION_TARIFF_TYPE } from 'constants/selectsOptions';
import { validateEmail } from 'helpers/validateEmail';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IAccommodation } from 'interfaces/accommodation.interface';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  data?: IAccommodation
};

const AccommodationDialog = ({ data, onClose, ...rest }:Props) => {
  const { t } = useTranslation();
  const { register, formState: { errors }, control, handleSubmit } = useForm<IAccommodation>({ defaultValues: data });
  const createAccommodation = useCreateAccommodation();
  const updateAccommodation = useUpdateAccommodation();

  const tariffTypes = useTranslatedSelect(ACCOMMODATION_TARIFF_TYPE, 'accommodationTariff');

  const submitHandler: SubmitHandler<IAccommodation> = (values) => {
    const mutation = values._id ? updateAccommodation : createAccommodation;
    mutation.mutateAsync(values).then(() => {
      onClose();
    });
  };

  return (
    <Dialog mobileFullscreen onClose={onClose} title={t('navbar.accommodation')} {...rest}>
      <DialogContentWrapper>
        <div className="form">
          <Input
            theme="gray"
            label={`${t('accommodation.owner')}*`}
            error={!!errors.owner}
            helperText={errors.owner?.message}
            className="form-field"
            {...register('owner', { required: true })}
          />
          <Input
            theme="gray"
            label={`${t('accommodation.adress')}*`}
            error={!!errors.adress}
            helperText={errors.adress?.message}
            className="form-field"
            {...register('adress', { required: true })}
          />
          <Input
            theme="gray"
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            className="form-field"
            {...register('email', { validate: (v) => !v || validateEmail(v) })}
          />
          <Controller
            control={control}
            name="managerPhone"
            defaultValue=""
            rules={{ validate: (value) => !value || checkPhoneNumber(value) }}
            render={({ field }) => (
              <PhoneInput
                theme="gray"
                value={field.value}
                onChange={field.onChange}
                label={t('accommodation.managerPhone')}
                error={!!errors.managerPhone}
                className="form-field"
              />
            )}
          />
          <Controller
            control={control}
            name="receptionPhone"
            defaultValue=""
            rules={{ validate: (value) => !value || checkPhoneNumber(value) }}
            render={({ field }) => (
              <PhoneInput
                theme="gray"
                value={field.value}
                onChange={field.onChange}
                label={t('accommodation.receptionPhone')}
                error={!!errors.receptionPhone}
                className="form-field"
              />
            )}
          />
          <Input
            theme="gray"
            label={t('accommodation.costNight')}
            error={!!errors.costNight}
            helperText={errors.costNight?.message}
            type="number"
            className="form-field"
            InputProps={{ endAdornment: <div style={{ width: 24 }}>€</div> }}
            {...register('costNight')}
          />
          <Input
            theme="gray"
            label={t('accommodation.costMonth')}
            error={!!errors.costMonth}
            helperText={errors.costMonth?.message}
            type="number"
            className="form-field"
            InputProps={{ endAdornment: <div style={{ width: 24 }}>€</div> }}
            {...register('costMonth')}
          />
          <Select
            theme="gray"
            label={t('accommodation.tariff')}
            error={!!errors.tariff}
            options={tariffTypes}
            className="form-field"
            defaultValue={data?.tariff || ''}
            {...register('tariff')}
          />
          <Input
            theme="gray"
            label={t('accommodation.comment')}
            error={!!errors.comment}
            helperText={errors.comment?.message}
            multiline
            className="form-field fullwidth"
            {...register('comment')}
          />
        </div>
        <div className="actions">
          <Button variant="contained" onClick={handleSubmit(submitHandler)} disabled={!isEmpty(errors)}>{t('approve')}</Button>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default AccommodationDialog;
