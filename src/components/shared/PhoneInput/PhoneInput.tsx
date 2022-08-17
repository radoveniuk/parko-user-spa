import React, { ForwardedRef, forwardRef } from 'react';
import { MuiTelInputProps, isValidPhoneNumber } from 'mui-tel-input';

import { StyledPhoneInput } from './styles';

const PhoneInput = (props: MuiTelInputProps, ref: ForwardedRef<HTMLInputElement>) => (
  <StyledPhoneInput
    ref={ref}
    defaultCountry="SK"
    preferredCountries={['UA', 'RU', 'SK']}
    {...props}
  />
);

export default forwardRef(PhoneInput);

export const checkPhoneNumber = isValidPhoneNumber;
