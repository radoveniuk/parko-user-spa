import { HTMLAttributes } from 'react';

export { default } from './Button';

export type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  component?: string;
  loading?: boolean;
  variant?: 'text' | 'outlined' | 'contained',
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
}
