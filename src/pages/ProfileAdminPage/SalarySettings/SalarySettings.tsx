import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import _ from 'lodash-es';

import Button from 'components/shared/Button';
import Input from 'components/shared/Input';
import Select from 'components/shared/Select';
import { SALARY_TYPE } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IUser } from 'interfaces/users.interface';

import { SalaryFormWrapper } from './styles';

type Props = {
  data: IUser;
  onUpdate(v: Partial<IUser>): void;
};

type SalaryFields = {
  salary: string;
  salaryType: string;
  salaryComment: string;
}

const SalarySettings = ({ data, onUpdate }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SalaryFields>();
  const { t } = useTranslation();
  const translatedSalaryTypes = useTranslatedSelect(SALARY_TYPE, 'tariff');

  const submitForm: SubmitHandler<SalaryFields> = (values) => {
    onUpdate(values);
  };

  return (
    <SalaryFormWrapper onSubmit={handleSubmit(submitForm)}>
      <div className="inputs">
        <Input
          label={t('user.salary')}
          type="number"
          defaultValue={data.salary}
          error={!!errors.salary}
          InputProps={{ endAdornment: '€' }}
          {...register('salary', { required: true })}
        />
        <Select
          options={translatedSalaryTypes}
          label={t('user.salaryType')}
          defaultValue={data.salaryType || ''}
          style={{ minWidth: 200 }}
          error={!!errors.salaryType}
          {...register('salaryType', { required: true })}
        />
        <Input defaultValue={data.salaryComment} label={t('user.salaryComment')} multiline {...register('salaryComment')} />
      </div>
      <Button className="button" type="submit" disabled={!_.isEmpty(errors)}>{t('user.updateData')}</Button>
    </SalaryFormWrapper>
  );
};

export default SalarySettings;
