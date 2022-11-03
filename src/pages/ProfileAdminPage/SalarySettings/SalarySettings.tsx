import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Input from 'components/shared/Input';
import Select from 'components/shared/Select';
import { SALARY_TYPE } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IUser, IUser2 } from 'interfaces/users.interface';

import { SalaryFormWrapper } from './styles';

type Props = {
  data: IUser;
};

const SalarySettings = ({ data }: Props) => {
  const { register, formState: { errors } } = useFormContext<IUser2>();
  const { t } = useTranslation();
  const translatedSalaryTypes = useTranslatedSelect(SALARY_TYPE, 'tariff');

  return (
    <SalaryFormWrapper>
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
    </SalaryFormWrapper>
  );
};

export default SalarySettings;
