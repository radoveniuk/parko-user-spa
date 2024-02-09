import React, { ForwardedRef, forwardRef, memo, useCallback } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';

import { EyeIcon, EyeSlashIcon } from 'components/icons';

import IconButton from '../IconButton';

import { InputWrapper } from './styles';

type FieldTheme = 'white' | 'gray';

const COLORS_MAP: Record<FieldTheme, string> = {
  gray: '#FAFAFA',
  white: '#FFFFFF',
};

export type InputProps = {
  showPasswordIcon?: boolean;
  maxWidth?: number;
  theme?: FieldTheme;
} & TextFieldProps;

const Input = ({
  showPasswordIcon, type, maxWidth, theme = 'white', label, className, ...props
}: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <InputWrapper className={className} style={{ maxWidth }} fieldColor={COLORS_MAP[theme]}>
      {!!label && <div className={`label${props.error ? ' error' : ''}`}>{label}</div>}
      <TextField
        ref={ref}
        type={showPasswordIcon ? (showPassword ? 'text' : 'password') : type}
        InputProps={showPasswordIcon
          ? {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleClickShowPassword}
                >
                  {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }
          : {}}
        {...props}
        label={undefined}
      />
    </InputWrapper>
  );
};
export default memo(forwardRef(Input));
