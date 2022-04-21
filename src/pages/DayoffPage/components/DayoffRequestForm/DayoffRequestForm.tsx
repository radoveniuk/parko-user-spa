import React from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import _ from 'lodash-es';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import DatePicker from 'components/shared/DatePicker';
import Select from 'components/shared/Select';
import { REASONS } from 'constants/dayoffReasons';
import Input from 'components/shared/Input';
import Button from 'components/shared/Button';

import { StyledForm } from './styles';

type Inputs = {
  dateStart: DateTime,
  dateEnd: DateTime,
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
  const reasonsList = useGetDayoffReasons();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <div className="fields-grid">
        <Controller
          control={control}
          name="dateStart"
          defaultValue={DateTime.now()}
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
          defaultValue={DateTime.now()}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              label={t('dayoffPage.form.dateEnd')}
            />
          )}
        />
        <Select label={t('dayoffPage.form.reason')} options={reasonsList} {...register('reason')}/>
        <Input
          multiline
          label={t('dayoffPage.form.comment')}
          error={!!errors.comment?.message}
          helperText={errors.comment?.message}
          {...register('comment', { required: { message: 'Give a reason', value: watch('reason') === 'other' } })}
        />
      </div>
      <Button className="button-wrapper" type="submit" disabled={!_.isEmpty(errors)}>{t('prepaymentPage.form.order')}</Button>
    </StyledForm>
  );
};

export default DayoffRequestForm;
