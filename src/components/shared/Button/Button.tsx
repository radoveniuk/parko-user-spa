import React from 'react';
import { ButtonProps } from '@mui/material';
import { StyledButton } from './styles';

const Button = ({ children, variant = 'contained', ...rest }: ButtonProps) => (
  <StyledButton variant={variant} {...rest}>
    {children}
  </StyledButton>
);

export default Button;
