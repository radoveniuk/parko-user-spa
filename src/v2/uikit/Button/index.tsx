import React, { memo } from 'react';
import { Button as ButtonMui, ButtonProps } from '@mui/material';

import { ButtonWrapper } from './styles';

const Button = (props: ButtonProps) => (
  <ButtonWrapper><ButtonMui {...props} /></ButtonWrapper>
);

export default memo(Button);
