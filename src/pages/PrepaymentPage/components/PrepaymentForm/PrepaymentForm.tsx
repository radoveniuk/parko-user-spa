import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash-es';
import Button from 'v2/uikit/Button';
import Input from 'v2/uikit/Input';

import { useCreatePrepaymentMutation } from 'api/mutations/prepaymentMutation';
import { useAuthData } from 'contexts/AuthContext';

import { StyledForm } from './styles';

type Inputs = {
  sum: string,
  comment: string,
};

const PrepaymentForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const { id } = useAuthData();
  const { t } = useTranslation();
  const createPrepayment = useCreatePrepaymentMutation();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const prepayment = {
      user: id,
      userComment: data.comment,
      sum: data.sum,
      isApproved: null,
    };

    createPrepayment.mutateAsync(prepayment)
      .then(() => {
        setTimeout(() => {
          navigate('/');
        }, 1000);
      });
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <div className="fields-list">
        <Input
          label={t('prepayment.sum')}
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
          label={t('prepayment.comment')}
          {...register('comment')}
        />
      </div>
      <Button
        className="button-wrapper"
        type="submit"
        disabled={!_.isEmpty(errors) || createPrepayment.isLoading}
      >
        {t('prepaymentPage.form.order')}
      </Button>
    </StyledForm>
  );
};

export default PrepaymentForm;
