import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash-es';
import { DateTime } from 'luxon';
import Button from 'v2/uikit/Button';
import DatePicker from 'v2/uikit/DatePicker';
import Input from 'v2/uikit/Input';
import Select from 'v2/uikit/Select';

import { useCreateDayoffMutation } from 'api/mutations/dayoffMutation';
import { REASONS } from 'constants/dayoffReasons';
import { useAuthData } from 'contexts/AuthContext';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

import { StyledForm } from './styles';

type Inputs = {
  dateStart: string,
  dateEnd: string,
  reason: typeof REASONS[number],
  comment: string,
};

const DayoffRequestForm = () => {
  const { handleSubmit, watch, control, register, formState: { errors } } = useForm<Inputs>();
  const { t } = useTranslation();
  const { id } = useAuthData();
  const reasonsList = useTranslatedSelect(REASONS, 'dayoffReason', true, false);
  const createDayoffMutation = useCreateDayoffMutation();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const dayoff = {
      user: id,
      description: data.comment,
      reason: data.reason,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
      isApproved: null,
    };

    createDayoffMutation.mutateAsync(dayoff).then(() => {
      setTimeout(() => {
        navigate('/');
      }, 1000);
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
              defaultValue={field.value}
              onChange={field.onChange}
              label={t('dayoff.dateStart')}
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
              defaultValue={field.value}
              onChange={field.onChange}
              label={t('dayoff.dateEnd')}
            />
          )}
        />
        <Select label={t('dayoff.reason')} options={reasonsList} error={!!errors.reason} {...register('reason', { required: true })}/>
        <Input
          multiline
          label={t('dayoff.comment')}
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
