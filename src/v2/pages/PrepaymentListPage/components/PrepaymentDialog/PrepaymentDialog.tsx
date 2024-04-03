import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import isObject from 'lodash-es/isObject';
import { Button, Input } from 'v2/uikit';
import Autocomplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Select from 'v2/uikit/Select';

import { PREPAYMENT_STATUS } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IUser } from 'interfaces/users.interface';

import { PrepaymentDialogContent } from './styles';

type Props = DialogProps & {
  onSave(values: IPrepayment): void;
  data?: IPrepayment
};

const PrepaymentDialog = ({ onSave, data, ...rest }: Props) => {
  const { t } = useTranslation();
  const prepaymentStatusList = useTranslatedSelect(PREPAYMENT_STATUS, 'prepaymentStatus');
  const { control, register, formState: { errors }, handleSubmit, watch, clearErrors } = useForm<IPrepayment>();
  const queryClient = useQueryClient();
  const users: IUser[] = queryClient.getQueryData(['users-filter', JSON.stringify({})]) || [];

  const submitHandler: SubmitHandler<IPrepayment> = (values) => {
    onSave({ ...values, user: isObject(values.user) ? (values.user as IUser)?._id : values.user });
  };

  return (
    <Dialog
      mobileFullscreen
      title={t('prepayment.prepayment')}
      {...rest}
    >
      <PrepaymentDialogContent>
        <div className="form">
          <Controller
            control={control}
            name="user"
            defaultValue={data?.user}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Autocomplete
                label={`${t('prepayment.user')}*`}
                options={users}
                valueKey="_id"
                theme="gray"
                error={!!fieldState.error}
                getOptionLabel={(option) => `${option.name} ${option.surname} ${option.project ? `(${option.project.name})` : ''}`}
                defaultValue={data?.user || null}
                onChange={(v) => void field.onChange(v?._id || '')}
              />
            )}
          />
          <Input
            InputProps={{ endAdornment: <div style={{ width: 24 }}>€</div> }}
            label={`${t('prepayment.sum')}*`}
            defaultValue={data?.sum || ''}
            type="number"
            error={!!errors.sum}
            theme="gray"
            {...register('sum', { required: true })}
          />
          <Select
            theme="gray"
            label={t('prepayment.status')}
            error={!!errors.status}
            options={prepaymentStatusList}
            defaultValue={data?.status || 'pending'}
            {...register('status', {
              onChange (v) {
                if (v.target.value !== 'rejected') {
                  clearErrors(['adminComment']);
                }
              },
            })}
          />
          <Controller
            control={control}
            name="paymentDate"
            defaultValue={data?.paymentDate || null}
            render={({ field }) => (
              <DatePicker
                defaultValue={field.value}
                onChange={field.onChange}
                label={t('prepayment.paymentDate')}
                inputProps={{ theme: 'gray' }}
                views={['day']}
              />
            )}
          />
          <Input
            label={`${t('prepayment.comment')}${watch('status') === 'rejected' ? '*' : ''}`}
            defaultValue={data?.adminComment || ''}
            theme="gray"
            className="fullwidth"
            error={!!errors.adminComment}
            {...register('adminComment', { required: watch('status') === 'rejected' })}
          />
        </div>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSubmit(submitHandler)}
          >
            {t('save')}
          </Button>
        </DialogActions>
      </PrepaymentDialogContent>
    </Dialog>
  );
};

export default PrepaymentDialog;
