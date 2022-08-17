import React, { ForwardedRef, forwardRef } from 'react';
import { MuiTelInputProps, isValidPhoneNumber } from 'mui-tel-input';

import { StyledPhoneInput } from './styles';
import { useTranslation } from 'react-i18next';

const PhoneInput = (props: MuiTelInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { i18n } = useTranslation();

  return (
    <StyledPhoneInput
      ref={ref}
      defaultCountry="SK"
      onlyCountries={['UA', 'RU', 'SK', 'GE', 'BY']}
      langOfCountryName={i18n.language}
      {...props}
    />
  );
};

export default forwardRef(PhoneInput);

export const checkPhoneNumber = isValidPhoneNumber;
