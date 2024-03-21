import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select, { FieldTheme } from 'v2/uikit/Select';

import useTranslatedSelect from 'hooks/useTranslatedSelect';

type Props = {
  defaultValue?: boolean;
  onChange(value: boolean | null): void;
  label?: string;
  isEmptyItem?: boolean;
  className?: string;
  theme?: FieldTheme;
};

const booleanOptions = ['true', 'false'];

const BooleanSelect = ({ defaultValue, onChange, label, isEmptyItem = true, ...rest }: Props) => {
  const { t } = useTranslation();
  const options = useTranslatedSelect(booleanOptions);
  const [value, setValue] = useState(defaultValue !== undefined ? `${defaultValue}` : '');

  return (
    <Select
      {...rest}
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
      emptyItem={isEmptyItem ? t('noSelected') : undefined}
      label={label}
    />
  );
};

export default BooleanSelect;
