import React, { memo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import { FormCard, FormCardBody, FormCardBodyRow, FormCardHeader } from 'v2/uikit/FormCard';

import { BankIcon, FactoryIcon } from 'components/icons';
import { IUser } from 'interfaces/users.interface';

type EmploymentInfo = Pick<IUser, 'passNumber' | 'ICO' | 'rodneCislo' | 'medicalInsurance' | 'country' | 'birthDate' | 'birthPlace' | 'familyStatus' | 'birthSurname' | 'childrenCount'>;

type Props = {
  data: EmploymentInfo;
};

const EmploymentInfoFormCard = ({ data }: Props) => {
  const { t } = useTranslation();
  const { register } = useForm<EmploymentInfo>({ defaultValues: data });
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
                }}
              >
                {t('save')}
              </Button>)}
          </FormCardHeader>
          <FormCardBody>
            <FormCardBodyRow>

            </FormCardBodyRow>
          </FormCardBody>
        </>
      )}
    </FormCard>
  );
};

export default memo(EmploymentInfoFormCard);
