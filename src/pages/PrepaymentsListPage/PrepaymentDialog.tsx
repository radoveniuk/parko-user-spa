import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import Autocomplete from 'v2/uikit/Autocomplete';
import Button from 'v2/uikit/Button';
import DatePicker from 'v2/uikit/DatePicker';
import Input from 'v2/uikit/Input';
import Select from 'v2/uikit/Select';

import { useGetUserListForFilter } from 'api/query/userQuery';
import Dialog, { DialogActions, DialogProps } from 'components/shared/Dialog';
import { PREPAYMENT_STATUS } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IPrepayment } from 'interfaces/prepayment.interface';

import { PrepaymentFormWrapper } from './styles';

type Props = DialogProps & {
  prepayment?: IPrepayment;
  submit: (v: IPrepayment) => void;
}

const PrepaymentDialog = ({ prepayment, submit, ...rest }: Props) => {
  const { t } = useTranslation();
  const { data: users = [] } = useGetUserListForFilter();
  const translatedPrepaymentStatuses = useTranslatedSelect(PREPAYMENT_STATUS, 'prepaymentStatus', true, false);

  const { control, formState: { errors }, register, watch, handleSubmit } = useForm<IPrepayment>();

  const submitHandler: SubmitHandler<IPrepayment> = (values) => {
    submit(values);
  };

  return (
    <Dialog {...rest} title={t('prepayment.prepayment')} maxWidth={false}>
      <PrepaymentFormWrapper>
        {prepayment?.createdByRole !== 'user' && (
          <Controller
            control={control}
            name="user"
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                options={users}
                label={t('prepayment.user')}
                getOptionLabel={(option) => `${option.name} ${option.surname} ${option.project ? `(${option.project.name})` : ''}`}
                defaultValue={prepayment?.user || null}
                onChange={(v) => void field.onChange(v?._id || '')}
                error={!!errors.user}
              />
            )}
          />
        )}
        <Input
          label={t('prepayment.sum')}
          error={!!errors.sum}
          helperText={errors.sum?.message}
          type="number"
          defaultValue={prepayment?.sum || ''}
          {...register('sum', { required: true })}
        />
        {prepayment?.createdByRole !== 'user' && (
          <Controller
            control={control}
            name="createdAt"
            defaultValue={DateTime.now().toISODate()}
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                defaultValue={field.value}
                onChange={field.onChange}
                label={t('prepayment.date')}
                error={!!errors.createdAt}
              />
            )}
          />
        )}
        <Select
          label={t('prepayment.status')}
          error={!!errors.status}
          options={translatedPrepaymentStatuses}
          defaultValue={prepayment?.status || 'pending'}
          {...register('status')}
        />
        {watch('status') === 'paid' && (
          <Controller
            control={control}
            name="paymentDate"
            defaultValue={DateTime.now().toISODate()}
            render={({ field }) => (
              <DatePicker
                defaultValue={field.value}
                onChange={field.onChange}
                label={t('prepayment.paymentDate')}
              />
            )}
          />
        )}
      </PrepaymentFormWrapper>
      <DialogActions>
        <Button onClick={handleSubmit(submitHandler)}>{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrepaymentDialog;
