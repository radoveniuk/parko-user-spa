import React from 'react';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import _ from 'lodash-es';

import Input from 'components/shared/Input';
import TextArea from 'components/shared/TextArea';
import Button from 'components/shared/Button';
import { StyledForm } from './styles';

type Inputs = {
  sum: string,
  comment: string,
};

const PrepaymentForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const { t } = useTranslation();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  console.log(errors); // watch input value by passing the name of it

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <Input
        title={t('prepaymentPage.form.sum')}
        type="number"
        defaultValue="50"
        error={errors.sum?.message}
        {...register('sum', {
          required: true,
          min: { message: t('prepaymentPage.form.sumMinValidation'), value: 50 },
          max: { message: t('prepaymentPage.form.sumMaxValidation'), value: 200 },
        })}
      />
      <TextArea
        title={t('prepaymentPage.form.comment')}
        {...register('comment')}
      />
      <Button type="submit" disabled={!_.isEmpty(errors)}>{t('prepaymentPage.form.order')}</Button>
    </StyledForm>
  );
};

export default PrepaymentForm;
