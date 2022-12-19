import React, { useId } from 'react';
import { FormControl, FormControlLabel, FormControlLabelProps, FormLabel, Radio, RadioGroup, RadioGroupProps } from '@mui/material';

type RadioButtonGroupProps = RadioGroupProps & {
  label?: string;
}

export default function RadioButtonGroup ({
  label, children, ...rest
}: RadioButtonGroupProps) {
  const id = useId();
  return (
    <FormControl>
      <FormLabel id={id}>{label}</FormLabel>
      <RadioGroup
        aria-labelledby={id}
        {...rest}
      >
        {children}
      </RadioGroup>
    </FormControl>
  );
}

type RadioButtonProps = Partial<FormControlLabelProps> & { label: string, value: unknown };

export const RadioButton = (props: RadioButtonProps) => <FormControlLabel {...props} control={<Radio />} />;
