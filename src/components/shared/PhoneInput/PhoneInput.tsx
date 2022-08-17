import React, { ForwardedRef, forwardRef } from 'react';
import { MuiTelInputProps, isValidPhoneNumber } from 'mui-tel-input';
import { useTranslation } from 'react-i18next';

import { StyledPhoneInput } from './styles';

const PhoneInput = (props: MuiTelInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { i18n } = useTranslation();

  return (
    <StyledPhoneInput
      ref={ref}
      defaultCountry="SK"
      onlyCountries={['UA', 'SK', 'GE', 'PL', 'IN', 'VN', 'KZ', 'KG', 'HU', 'CZ', 'RS']}
      langOfCountryName={i18n.language}
      {...props}
    />
  );
};

export default forwardRef(PhoneInput);

export const checkPhoneNumber = isValidPhoneNumber;
