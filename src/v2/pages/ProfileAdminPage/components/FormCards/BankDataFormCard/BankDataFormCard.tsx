import React, { forwardRef, memo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PatternFormat, PatternFormatProps } from 'react-number-format';
import { useSnackbar } from 'notistack';
import { Button, Input } from 'v2/uikit';
import { FormCard, FormCardBody, FormCardBodyRow, FormCardHeader } from 'v2/uikit/FormCard';
import Loader from 'v2/uikit/Loader';

import api from 'api/common';
import { BankIcon, SearchIcon } from 'components/icons';
import createId from 'helpers/createId';
import { IUser } from 'interfaces/users.interface';

import { BankDataFormCardWrapper, LoaderWrapper } from './styles';

interface NumberFormatProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const IBANFormat = forwardRef<PatternFormatProps<string>, NumberFormatProps>(
  function NumberFormatCustom (props, ref) {
    const { onChange, ...other } = props;

    return (
      <PatternFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.formattedValue,
            },
          });
        }}
        format="SK## #### #### #### #### ####"
        mask="_"
      />
    );
  },
);

type BankInfo = Pick<IUser, 'IBAN' | 'bankName' | 'SWIFT'>;

type Props = {
  data: BankInfo;
  onUpdate(v: Partial<BankInfo>): void;
};

const BankDataFormCard = ({ data, onUpdate }: Props) => {
  const { t } = useTranslation();
  const { register, getValues, reset, watch, control, setValue } = useForm<BankInfo>({ defaultValues: data });
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [cardKey, setCardKey] = useState(createId());

  const fetchBankData = async () => {
    const iban = getValues('IBAN');

    if (iban.replaceAll('_', '').length !== 29) {
      enqueueSnackbar(t('errorTexts.wrongIbanFormat'), { variant: 'error' });
      return;
    }
    setLoading(true);
    const bankData = await api({ method: 'GET', url: `/api/bank/${iban}` }).then((res) => res.data.data);
    setLoading(false);
    setValue('SWIFT', bankData.swift);
    setValue('bankName', bankData.bank);
  };

  return (
    <FormCard
      defaultConfig={{ disabled: true }}
      onOutsideClick={({ warn }) => { warn(); }}
      onReset={() => { setCardKey(createId()); reset(); }}
      key={cardKey}
    >
      {({ formCardConfig, updateFormCardConfig }) => (
        <BankDataFormCardWrapper>
          {loading && <LoaderWrapper><Loader /></LoaderWrapper>}
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
              <div className="fullwidth iban-field">
                <Controller
                  control={control}
                  name="IBAN"
                  render={({ field }) => (
                    <Input
                      theme="gray"
                      disabled={formCardConfig.disabled}
                      label="IBAN"
                      className="iban-input"
                      InputProps={{ inputComponent: IBANFormat as any }}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Button
                  onClick={fetchBankData}
                  variant="outlined"
                  disabled={!watch('IBAN') || formCardConfig.disabled}
                >
                  <SearchIcon size={18} />{t('search')}
                </Button>
              </div>
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
        </BankDataFormCardWrapper>
      )}
    </FormCard>
  );
};

export default memo(BankDataFormCard);
