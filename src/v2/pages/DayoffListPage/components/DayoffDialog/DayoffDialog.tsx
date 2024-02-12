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

import { REASONS } from 'constants/dayoffReasons';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IUser } from 'interfaces/users.interface';

import { PrepaymentDialogContent } from './styles';

type Props = DialogProps & {
  onSave(values: IDayOff): void;
  data?: IDayOff
};

const DayoffDialog = ({ onSave, data, ...rest }: Props) => {
  const { t } = useTranslation();
  const translatedReasons = useTranslatedSelect(REASONS, 'dayoffReason', true, false);
  const { control, register, formState: { errors }, handleSubmit } = useForm<IDayOff>();
  const queryClient = useQueryClient();
  const users: IUser[] = queryClient.getQueryData(['users-filter', JSON.stringify({})]) || [];

  const submitHandler: SubmitHandler<IDayOff> = (values) => {
    onSave({ ...values, user: isObject(values.user) ? (values.user as IUser)?._id : values.user });
  };

  return (
    <Dialog
      mobileFullscreen
      title={t('dayoff.dayoff')}
      {...rest}
    >
      <PrepaymentDialogContent>
        <div className="form">
          <Controller
            control={control}
            name="user"
            defaultValue={data?.user}
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                theme="gray"
                options={users}
                label={t('prepayment.user')}
                getOptionLabel={(option) => `${option.name} ${option.surname} ${option.project ? `(${option.project.name})` : ''}`}
                defaultValue={data?.user || null}
                onChange={(v) => void field.onChange(v?._id || '')}
                error={!!errors.user}
              />
            )}
          />
          <Controller
            control={control}
            name="dateStart"
            defaultValue={data?.dateStart || ''}
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                defaultValue={field.value}
                onChange={field.onChange}
                label={t('dayoff.dateStart')}
                error={!!errors.dateStart}
                inputProps={{ theme: 'gray' }}
              />
            )}
          />
          <Controller
            control={control}
            name="dateEnd"
            defaultValue={data?.dateEnd || ''}
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                defaultValue={field.value}
                onChange={field.onChange}
                label={t('dayoff.dateEnd')}
                error={!!errors.dateEnd}
                inputProps={{ theme: 'gray' }}
              />
            )}
          />
          <Select
            label={t('dayoff.reason')}
            error={!!errors.reason}
            options={translatedReasons}
            defaultValue={data?.reason || ''}
            theme="gray"
            {...register('reason')}
          />
          <Input
            label={t('dayoff.adminComment')}
            defaultValue={data?.adminComment || ''}
            theme="gray"
            {...register('adminComment')}
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

export default DayoffDialog;
