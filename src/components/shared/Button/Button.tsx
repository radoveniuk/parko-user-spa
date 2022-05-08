import React from 'react';
import { ButtonProps } from '@mui/material';
import { StyledButton } from './styles';

type Props = ButtonProps & {
  component?: string;
}

const Button = ({ children, variant = 'contained', ...rest }: Props) => (
  <StyledButton variant={variant} {...rest}>
    {children}
  </StyledButton>
);

export default Button;
