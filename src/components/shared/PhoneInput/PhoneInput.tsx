import React, { ForwardedRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { isValidPhoneNumber, MuiTelInputProps } from 'mui-tel-input';

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
