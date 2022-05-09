import React from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash-es';
import { DateTime } from 'luxon';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import DatePicker from 'components/shared/DatePicker';
import Select from 'components/shared/Select';
import { REASONS } from 'constants/dayoffReasons';
import Input from 'components/shared/Input';
import Button from 'components/shared/Button';
import { useAuthData } from 'contexts/AuthContext';
import { useCreateDayoffMutation } from 'api/mutations/dayoffMutation';

import { StyledForm } from './styles';

type Inputs = {
  dateStart: string,
  dateEnd: string,
  reason: typeof REASONS[number],
  comment: string,
};

const useGetDayoffReasons = () => {
  const { t } = useTranslation();
  return REASONS.map((value) => ({
    value,
    label: t(`dayoffPage.form.reasons.${value}`),
  }));
};

const DayoffRequestForm = () => {
  const { handleSubmit, watch, control, register, formState: { errors } } = useForm<Inputs>();
  const { t } = useTranslation();
  const { id } = useAuthData();
  const reasonsList = useGetDayoffReasons();
  const { enqueueSnackbar } = useSnackbar();
  const createDayoffMutation = useCreateDayoffMutation();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const dayoff = {
      userId: id,
      description: data.comment,
      reason: data.reason,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
      isApproved: null,
    };

    createDayoffMutation.mutateAsync(dayoff).then(() => {
      enqueueSnackbar(t('dayoffPage.form.successCreate'), { variant: 'success' });
    });
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <div className="fields-grid">
        <Controller
          control={control}
          name="dateStart"
          defaultValue={DateTime.now().toISO()}
          rules={{ required: true }}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              label={t('dayoffPage.form.dateStart')}
            />
          )}
        />
        <Controller
          control={control}
          name="dateEnd"
          defaultValue={DateTime.now().plus({ days: 1 }).toISO()}
          rules={{ required: true }}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              label={t('dayoffPage.form.dateEnd')}
            />
          )}
        />
        <Select label={t('dayoffPage.form.reason')} options={reasonsList} error={!!errors.reason} {...register('reason', { required: true })}/>
        <Input
          multiline
          label={t('dayoffPage.form.comment')}
          error={!!errors.comment?.message}
          helperText={errors.comment?.message}
          {...register('comment', { required: { message: t('dayoffPage.form.explainReason'), value: watch('reason') === 'other' } })}
        />
      </div>
      <Button
        className="button-wrapper"
        type="submit"
        disabled={!_.isEmpty(errors)}
      >
        {t('prepaymentPage.form.order')}
      </Button>
    </StyledForm>
  );
};

export default DayoffRequestForm;
