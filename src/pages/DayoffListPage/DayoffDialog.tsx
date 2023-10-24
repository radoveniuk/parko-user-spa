import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useGetUserListForFilter } from 'api/query/userQuery';
import Autocomplete from 'components/shared/Autocomplete';
import Button from 'components/shared/Button';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'components/shared/Dialog';
import Input from 'components/shared/Input';
import Select from 'components/shared/Select';
import { REASONS } from 'constants/dayoffReasons';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IDayOff } from 'interfaces/dayoff.interface';

import { DayoffFormWrapper } from './styles';

type Props = DialogProps & {
  dayoff?: IDayOff;
  submit: (v: IDayOff) => void;
}

const DayoffDialog = ({ dayoff, submit, ...rest }: Props) => {
  const { t } = useTranslation();
  const { data: users = [] } = useGetUserListForFilter();
  const translatedReasons = useTranslatedSelect(REASONS, 'dayoffReason');

  const { control, formState: { errors }, register, handleSubmit } = useForm<IDayOff>();

  const submitHandler: SubmitHandler<IDayOff> = (values) => {
    submit(values);
  };

  return (
    <Dialog {...rest} title={t('dayoff.dayoff')} maxWidth={false}>
      <DayoffFormWrapper>
        <Controller
          control={control}
          name="user"
          defaultValue={dayoff?.user}
          rules={{ required: true }}
          render={({ field }) => (
            <Autocomplete
              options={users}
              label={t('prepayment.user')}
              getOptionLabel={(option) => `${option.name} ${option.surname} ${option.project ? `(${option.project.name})` : ''}`}
              defaultValue={dayoff?.user || null}
              onChange={(v) => void field.onChange(v?._id || '')}
              error={!!errors.user}
            />
          )}
        />
        <Controller
          control={control}
          name="dateStart"
          defaultValue={dayoff?.dateStart || ''}
          rules={{ required: true }}
          render={({ field }) => (
            <DatePicker
              defaultValue={field.value}
              onChange={field.onChange}
              label={t('dayoff.dateStart')}
              error={!!errors.dateStart}
            />
          )}
        />
        <Controller
          control={control}
          name="dateEnd"
          defaultValue={dayoff?.dateEnd || ''}
          rules={{ required: true }}
          render={({ field }) => (
            <DatePicker
              defaultValue={field.value}
              onChange={field.onChange}
              label={t('dayoff.dateEnd')}
              error={!!errors.dateEnd}
            />
          )}
        />
        <Select
          label={t('dayoff.reason')}
          error={!!errors.reason}
          options={translatedReasons}
          defaultValue={dayoff?.reason || ''}
          {...register('reason')}
        />
        <Input
          label={t('dayoff.adminComment')}
          defaultValue={dayoff?.adminComment || ''}
          {...register('adminComment')}
        />
      </DayoffFormWrapper>
      <DialogActions>
        <Button onClick={handleSubmit(submitHandler)}>{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DayoffDialog;
