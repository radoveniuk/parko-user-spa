import React, { memo } from 'react';
import { RadioGroupProps } from '@mui/material';

import { RadioGroupWrapper } from './styles';

const RadioGroup = (props: RadioGroupProps) => (
  <RadioGroupWrapper {...props}>
    {props.children}
  </RadioGroupWrapper>
);

export default memo(RadioGroup);
