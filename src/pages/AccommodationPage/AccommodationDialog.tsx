import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash-es';

import Button from 'components/shared/Button';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import Input from 'components/shared/Input';
import PhoneInput, { checkPhoneNumber } from 'components/shared/PhoneInput';
import Select from 'components/shared/Select';
import { ACCOMMODATION_TARIFF_TYPE } from 'constants/selectsOptions';
import { validateEmail } from 'helpers/validateEmail';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IAccommodation } from 'interfaces/accommodation.interface';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  data?: IAccommodation
};

const AccommodationDialog = ({ data, ...rest }:Props) => {
  const { t } = useTranslation();
  const { register, formState: { errors }, control, handleSubmit } = useForm<IAccommodation>({ defaultValues: data });

  const tariffTypes = useTranslatedSelect(ACCOMMODATION_TARIFF_TYPE, 'accommodationTariff');

  const submitHandler: SubmitHandler<IAccommodation> = (values) => {
    console.log(values);
  };

  return (
    <Dialog title={t('navbar.accommodation')} {...rest}>
      <DialogContentWrapper>
        <div className="form">
          <Input
            label={t('accommodation.owner')}
            error={!!errors.owner}
            helperText={errors.owner?.message}
            className="form-field"
            {...register('owner', { required: true })}
          />
          <Input
            label={t('accommodation.adress')}
            error={!!errors.adress}
            helperText={errors.adress?.message}
            className="form-field"
            {...register('adress', { required: true })}
          />
          <Input
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
                value={field.value}
                onChange={field.onChange}
                label={t('accommodation.receptionPhone')}
                error={!!errors.receptionPhone}
                className="form-field"
              />
            )}
          />
          <Input
            label={t('accommodation.cost')}
            error={!!errors.cost}
            helperText={errors.cost?.message}
            type="number"
            className="form-field"
            {...register('cost')}
          />
          <Select
            label={t('accommodation.tariff')}
            error={!!errors.tariff}
            options={tariffTypes}
            className="form-field"
            {...register('tariff')}
          />
          <Input
            label={t('accommodation.comment')}
            error={!!errors.comment}
            helperText={errors.comment?.message}
            multiline
            className="form-field"
            {...register('comment')}
          />
        </div>
        <div className="actions">
          <Button onClick={handleSubmit(submitHandler)} disabled={!isEmpty(errors)}>{t('OK')}</Button>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default AccommodationDialog;
