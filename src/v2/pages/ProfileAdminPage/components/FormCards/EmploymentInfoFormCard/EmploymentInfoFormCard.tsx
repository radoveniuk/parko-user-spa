import React, { memo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { COUNTRIES } from 'v2/constants/countries';
import { Button, Input } from 'v2/uikit';
import { FormCard, FormCardBody, FormCardHeader } from 'v2/uikit/FormCard';
import Select from 'v2/uikit/Select';

import { FactoryIcon } from 'components/icons';
import { FAMILY_STATUSES, INSURANCE } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IUser } from 'interfaces/users.interface';

import { CountrySelectOption, StyledFormCardBodyRow } from './styles';

type EmploymentInfo = Partial<Pick<IUser, 'passNumber' | 'rodneCislo' | 'medicalInsurance' |
 'country' | 'birthDate' | 'birthPlace' | 'familyStatus' | 'birthSurname' | 'childrenCount'>>;

type Props = {
  data: EmploymentInfo;
  onUpdateEmploymentInfo?(value: EmploymentInfo): void;
};

const EmploymentInfoFormCard = ({ data, onUpdateEmploymentInfo }: Props) => {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<EmploymentInfo>({ defaultValues: data });

  const familyStateOptions = useTranslatedSelect(FAMILY_STATUSES, 'familyStatus');

  const submitHandler: SubmitHandler<EmploymentInfo> = (values) => {
    onUpdateEmploymentInfo?.(values);
  };

  return (
    <FormCard defaultConfig={{ disabled: true }}>
      {({ formCardConfig, updateFormCardConfig }) => (
        <>
          <FormCardHeader icon={<FactoryIcon size={24} />} title={t('user.employmentInfo')}>
            {formCardConfig.disabled && <Button onClick={() => void updateFormCardConfig({ disabled: false })}>{t('edit')}</Button>}
            {!formCardConfig.disabled && (
              <Button
                color="error"
                onClick={() => {
                  updateFormCardConfig({ disabled: true });
                  handleSubmit(submitHandler)();
                }}
              >
                {t('save')}
              </Button>)}
          </FormCardHeader>
          <FormCardBody>
            <StyledFormCardBodyRow>
              <Input
                theme="gray"
                label={t('user.passNumber')}
                disabled={formCardConfig.disabled}
                {...register('passNumber')}
              />
              <Input
                theme="gray"
                label={t('user.rodneCislo')}
                disabled={formCardConfig.disabled}
                {...register('rodneCislo')}
              />
              <Select
                theme="gray"
                label={t('user.insurance')}
                disabled={formCardConfig.disabled}
                options={INSURANCE}
                defaultValue={data.medicalInsurance}
                {...register('medicalInsurance')}
              />
              <Select
                theme="gray"
                disabled={formCardConfig.disabled}
                options={COUNTRIES}
                labelPath={(data) => (
                  <CountrySelectOption><img src={`https://flagcdn.com/w20/${data.code}.png`} className="mr-12" />{data.value}</CountrySelectOption>
                )}
                label={t('user.country')}
                defaultValue={data.country}
                {...register('country')}
              />
              <Input
                theme="gray"
                label={t('user.birthPlace')}
                disabled={formCardConfig.disabled}
                {...register('birthPlace')}
              />
              <Select
                theme="gray"
                label={t('user.familyState')}
                disabled={formCardConfig.disabled}
                options={familyStateOptions}
                defaultValue={data.familyStatus}
                {...register('familyStatus')}
              />
              <Input
                theme="gray"
                label={t('user.birthSurname')}
                disabled={formCardConfig.disabled}
                {...register('birthSurname')}
              />
              <Input
                theme="gray"
                label={t('user.childrenCount')}
                disabled={formCardConfig.disabled}
                type="number"
                {...register('childrenCount')}
              />
            </StyledFormCardBodyRow>
          </FormCardBody>
        </>
      )}
    </FormCard>
  );
};

export default memo(EmploymentInfoFormCard);
