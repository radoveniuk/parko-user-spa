import React, { ForwardedRef, forwardRef } from 'react';
import { TextFieldProps } from '@mui/material';

import { TextField } from './styles';

const NOT_NUMBER_VALUES = ['e', 'E', '+', '-', '.', '.'];

const Input = (props: TextFieldProps, ref: ForwardedRef<HTMLInputElement>) => (
  <TextField
    ref={ref}
    onKeyDown={(e) => {
      if (props.type === 'number') {
        if (NOT_NUMBER_VALUES.includes(e.key)) {
          e.preventDefault();
        }
      }
    }}
    {...props}
  />
);

Input.displayName = 'Input';

export default forwardRef(Input);
