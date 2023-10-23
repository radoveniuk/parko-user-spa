import React, { HTMLAttributes } from 'react';

import { StyledButton } from './styles';

export type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  component?: string;
  loading?: boolean;
  variant?: 'text' | 'outlined' | 'contained',
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
}

const Button = ({ children, variant = 'contained', ...rest }: ButtonProps) => (
  <StyledButton variant={variant} {...rest}>
    {children}
  </StyledButton>
);

export default Button;
