import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import Autocomplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Select from 'v2/uikit/Select';

import { useGetUserListForFilter } from 'api/query/userQuery';
import { PREPAYMENT_STATUS } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IPrepayment } from 'interfaces/prepayment.interface';

import { PrepaymentDialogContent } from './styles';

type Props = DialogProps & {
  onSave(values: IPrepayment): void;
  data?: IPrepayment
};

const PrepaymentDialog = ({ onSave, data, ...rest }: Props) => {
  const { t } = useTranslation();
  const prepaymentStatusList = useTranslatedSelect(PREPAYMENT_STATUS, 'prepaymentStatus');
  const { control, register, formState: { errors }, handleSubmit } = useForm<IPrepayment>();
  const { data: users = [] } = useGetUserListForFilter();

  const submitHandler: SubmitHandler<IPrepayment> = (values) => {
    onSave(values);
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
            defaultValue={data?.period || undefined}
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                label={t('prepayment.user')}
                options={users}
                valueKey="_id"
                getOptionLabel={(user) => `${user.name} ${user.surname}`}
                theme="gray"
              />
            )}
          />
          <Controller
            control={control}
            name="period"
            defaultValue={data?.period || undefined}
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                views={['year', 'month']}
                format="MM/yyyy"
                openTo="month"
                defaultValue={field.value}
                onChange={field.onChange}
                label={`${t('prepayment.period')}*`}
                error={!!errors.period}
                inputProps={{ theme: 'gray' }}
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
            {...register('status')}
          />
          <Controller
            control={control}
            name="paymentDate"
            defaultValue={data?.paymentDate || null}
            render={({ field }) => (
              <DatePicker
                views={['year', 'month']}
                defaultValue={field.value}
                onChange={field.onChange}
                label={t('prepayment.paymentDate')}
                inputProps={{ theme: 'gray' }}
              />
            )}
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
