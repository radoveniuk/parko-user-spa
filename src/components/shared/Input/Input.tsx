import React, { ForwardedRef, forwardRef } from 'react';
import { TextFieldProps } from '@mui/material';
import { TextField } from './styles';

const NOT_NUMBER_VALUES = ['e', 'E', '+', '-', '.', '.'];

const Input = forwardRef(({ type, ...rest }: TextFieldProps, ref: ForwardedRef<HTMLInputElement>) => (
  <TextField
    ref={ref}
    type={type}
    onKeyDown={(e) => {
      if (type === 'number') {
        if (NOT_NUMBER_VALUES.includes(e.key)) {
          e.preventDefault();
        }
      }
    }}
    {...rest}
  />
));

Input.displayName = 'Input';

export default Input;
