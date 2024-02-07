import React, { ForwardedRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { isValidPhoneNumber, MuiTelInputProps } from 'mui-tel-input';

import { InputWrapper, StyledPhoneInput } from './styles';

type FieldTheme = 'white' | 'gray';

const COLORS_MAP: Record<FieldTheme, string> = {
  gray: '#FAFAFA',
  white: '#FFFFFF',
};

type Props = MuiTelInputProps & {
  theme?: FieldTheme;
}

const PhoneInput = ({ label, className, theme = 'white', ...props }: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const { i18n } = useTranslation();

  return (
    <InputWrapper className={className} fieldColor={COLORS_MAP[theme]}>
      <div className={`label${props.error ? ' error' : ''}`}>{label}</div>
      <StyledPhoneInput
        ref={ref}
        defaultCountry="SK"
        onlyCountries={['UA', 'SK', 'GE', 'PL', 'IN', 'VN', 'KZ', 'KG', 'HU', 'CZ', 'RS']}
        langOfCountryName={i18n.language}
        {...props}
      />
    </InputWrapper>
  );
};

export default forwardRef(PhoneInput);

export const checkPhoneNumber = isValidPhoneNumber;
