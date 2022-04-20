import React from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import DatePicker from 'components/shared/DatePicker';

import { StyledForm } from './styles';

type Inputs = {
  dateStart: DateTime,
  dateEnd: DateTime,
};

const DayoffRequestForm = () => {
  const { handleSubmit, watch, control } = useForm<Inputs>();
  const { t } = useTranslation();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  console.log(watch('dateStart'));

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <div className="dayoff-dates-wrapper">
        <Controller
          control={control}
          name="dateStart"
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
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              label={t('dayoffPage.form.dateEnd')}
            />
          )}
        />
      </div>
    </StyledForm>
  );
};

export default DayoffRequestForm;
