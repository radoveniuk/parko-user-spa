import React, { ForwardedRef, forwardRef, memo, useCallback } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';

import { EyeIcon, EyeSlashIcon, InfoIcon } from 'components/icons';

import IconButton from '../IconButton';
import Tooltip from '../Tooltip';

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
  tooltip?: string;
} & TextFieldProps;

const Input = ({
  showPasswordIcon, type, maxWidth, theme = 'white', label, className, tooltip, ...props
}: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const nameCyrillicValidator = (e: any) => {
    function containsCyrillicCharacters (str: string): boolean {
      const cyrillicRegex = /[а-яА-Я]/;
      return cyrillicRegex.test(str);
    }
    if (containsCyrillicCharacters(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <InputWrapper className={className} style={{ maxWidth }} fieldColor={COLORS_MAP[theme]}>
      <div className={`label${props.error ? ' error' : ''}`}>
        {label}
        {!!tooltip && <div className="tooltip"><Tooltip title={tooltip}><InfoIcon /></Tooltip></div>}
      </div>
      <TextField
        ref={ref}
        type={showPasswordIcon ? (showPassword ? 'text' : 'password') : type}
        onKeyPress={nameCyrillicValidator}
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
        label={undefined}
        {...props}
      />
    </InputWrapper>
  );
};
export default memo(forwardRef(Input));
