import React, { ForwardedRef, forwardRef } from 'react';
import { Checkbox as CheckBoxMaterial, CheckboxProps, FormControlLabel } from '@mui/material';

const Checkbox = forwardRef(({ title, ...rest }: CheckboxProps, ref: ForwardedRef<HTMLButtonElement>) => (
  <FormControlLabel control={<CheckBoxMaterial ref={ref} {...rest} />} label={title}/>
));

Checkbox.displayName = 'Input';

export default Checkbox;
