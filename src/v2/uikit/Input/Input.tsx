import React, { memo, useCallback } from 'react';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';

import { EyeIcon, EyeSlashIcon } from 'components/icons';

import { InputWrapper } from './styles';

export type InputProps = {
  showPasswordIcon?: boolean;
  maxWidth?: number;
} & TextFieldProps;

const Input = ({ showPasswordIcon, type, maxWidth, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <InputWrapper style={{ maxWidth }}>
      <div className="label">{props.label}</div>
      <TextField
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
export default memo(Input);
