import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Select from 'components/shared/Select';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

type Props = {
  defaultValue?: boolean;
  onChange(value: boolean | null): void;
  label?: string;
};

const booleanOptions = ['true', 'false'];

const BooleanSelect = ({ defaultValue, onChange, label }: Props) => {
  const { t } = useTranslation();
  const options = useTranslatedSelect(booleanOptions);
  const [value, setValue] = useState(defaultValue !== undefined ? `${defaultValue}` : '');

  return (
    <Select
      options={options}
      onChange={(e) => {
        const selectedOption = e.target.value as string;
        setValue(selectedOption);
        if (booleanOptions.includes(selectedOption)) {
          onChange(selectedOption === 'true');
        } else {
          onChange(null);
        }
      }}
      value={value}
      emptyItem={t('noSelected')}
      label={label}
    />
  );
};

export default BooleanSelect;
