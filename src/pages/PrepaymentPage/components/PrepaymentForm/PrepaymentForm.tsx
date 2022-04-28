import React from 'react';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import _ from 'lodash-es';

import Input from 'components/shared/Input';
import Button from 'components/shared/Button';
import { useAuthData } from 'contexts/AuthContext';
import { useCreatePrepaymentMutation } from 'api/mutations/prepaymentMutation';

import { StyledForm } from './styles';
import { useSnackbar } from 'notistack';

type Inputs = {
  sum: string,
  comment: string,
};

const PrepaymentForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const { id } = useAuthData();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const createPrepayment = useCreatePrepaymentMutation();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const prepayment = {
      userId: id,
      userComment: data.comment,
      sum: data.sum,
      isApproved: null,
    };

    createPrepayment.mutate(prepayment);
    enqueueSnackbar('prepayment created', { variant: 'success' });
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <div className="fields-list">
        <Input
          label={t('prepaymentPage.form.sum')}
          type="number"
          defaultValue="50"
          error={!!errors.sum?.message}
          helperText={errors.sum?.message}
          className="input-wrapper"
          {...register('sum', {
            required: true,
            min: { message: t('prepaymentPage.form.sumMinValidation'), value: 50 },
            max: { message: t('prepaymentPage.form.sumMaxValidation'), value: 200 },
          })}
        />
        <Input
          multiline
          className="input-wrapper"
          label={t('prepaymentPage.form.comment')}
          {...register('comment')}
        />
      </div>
      <Button className="button-wrapper" type="submit" disabled={!_.isEmpty(errors)}>{t('prepaymentPage.form.order')}</Button>
    </StyledForm>
  );
};

export default PrepaymentForm;
