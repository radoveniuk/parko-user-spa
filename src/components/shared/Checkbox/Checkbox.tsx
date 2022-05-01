import React, { ForwardedRef, forwardRef } from 'react';
import { FormControlLabel, Checkbox as CheckBoxMaterial, CheckboxProps } from '@mui/material';

const Checkbox = forwardRef(({ title, ...rest }: CheckboxProps, ref: ForwardedRef<HTMLButtonElement>) => (
  <FormControlLabel control={<CheckBoxMaterial ref={ref} {...rest} />} label={title}/>
));

Checkbox.displayName = 'Input';

export default Checkbox;
