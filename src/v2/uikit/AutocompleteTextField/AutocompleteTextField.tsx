import React, { ForwardedRef, forwardRef, memo, useState } from 'react';
import useBoolean from 'v2/hooks/useBoolean';

import Input from '../Input';

import { StyledAutocomplete } from './styles';

type FieldTheme = 'white' | 'gray';

export type AutocompleteProps = {
  options: string[];
  label?: string;
  style?: React.CSSProperties;
  onChange?(value: any | any[] | null): void;
  value?: any;
  defaultValue?: any;
  className?: string;
  error?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxWidth?: number;
  theme?: FieldTheme;
  required?: boolean;
}

const AutocompleteTextField = ({
  label, onChange, value: defaultValue, error,
  placeholder, disabled, maxWidth, required,
  theme = 'white', ...rest
}: AutocompleteProps, ref: ForwardedRef<HTMLInputElement>) => {
  const [isOpen, open, close] = useBoolean(false);
  const [value, setValue] = useState('');

  return (
    <StyledAutocomplete
      theme={theme}
      style={{ minWidth: 223, maxWidth }}
      onChange={(e, newValue) => {
        onChange?.(newValue);
      }}
      value={defaultValue}
      disabled={disabled}
      popupIcon={null}
      noOptionsText={null}
      clearIcon={null}
      freeSolo
      renderInput={(params) => (
        <Input
          {...params}
          label={label}
          theme={theme}
          error={error}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value as string);
            onChange?.(e.target.value);
          }}
          ref={ref}
          required={required}
        />
      )}
      open={isOpen}
      onOpen={open}
      onClose={close}
      {...rest}
    />
  );
};

export default memo(forwardRef(AutocompleteTextField));
