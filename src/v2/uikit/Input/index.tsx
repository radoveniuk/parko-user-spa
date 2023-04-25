import React, { memo, useCallback } from 'react';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';

import { EyeIcon, EyeSlashIcon } from 'components/icons';

import { InputWrapper } from './styles';

type IInput = {
  showPasswordIcon?: boolean
} & TextFieldProps

const Input = ({ showPasswordIcon, type, ...props }: IInput) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <InputWrapper>
      <TextField {...props}
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
          : {}}/>

    </InputWrapper>
  );
};
export default memo(Input);
