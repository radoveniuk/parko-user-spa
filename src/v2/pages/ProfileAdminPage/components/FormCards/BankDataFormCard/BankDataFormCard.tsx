import React, { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import { FormCard, FormCardBody, FormCardBodyRow, FormCardHeader } from 'v2/uikit/FormCard';

import { BankIcon } from 'components/icons';
import createId from 'helpers/createId';
import { IUser } from 'interfaces/users.interface';

import { InputIBAN } from './styles';

type BankInfo = Pick<IUser, 'IBAN' | 'bankName' | 'SWIFT'>;

type Props = {
  data: BankInfo;
  onUpdate(v: Partial<BankInfo>): void;
};

const BankDataFormCard = ({ data, onUpdate }: Props) => {
  const { t } = useTranslation();
  const { register, getValues, reset } = useForm<BankInfo>({ defaultValues: data });

  const [cardKey, setCardKey] = useState(createId());

  return (
    <FormCard
      defaultConfig={{ disabled: true }}
      onOutsideClick={({ warn }) => { warn(); }}
      onReset={() => { setCardKey(createId()); reset(); }}
      key={cardKey}
    >
      {({ formCardConfig, updateFormCardConfig }) => (
        <>
          <FormCardHeader icon={<BankIcon size={24} />} title={t('user.bankInfo')}>
            {formCardConfig.disabled && <Button onClick={() => void updateFormCardConfig({ disabled: false })}>{t('edit')}</Button>}
            {!formCardConfig.disabled && (
              <Button
                color="error"
                onClick={() => {
                  onUpdate(getValues());
                  updateFormCardConfig({ disabled: true });
                }}
              >
                {t('save')}
              </Button>
            )}
          </FormCardHeader>
          <FormCardBody>
            <FormCardBodyRow>
              <InputIBAN
                theme="gray"
                disabled={formCardConfig.disabled}
                label="IBAN"
                {...register('IBAN')}
              />
              <Input
                theme="gray"
                disabled={formCardConfig.disabled}
                label={t('user.bankName')}
                {...register('bankName')}
              />
              <Input
                theme="gray"
                disabled={formCardConfig.disabled}
                label="SWIFT"
                {...register('SWIFT')}
              />
            </FormCardBodyRow>
          </FormCardBody>
        </>
      )}
    </FormCard>
  );
};

export default memo(BankDataFormCard);
