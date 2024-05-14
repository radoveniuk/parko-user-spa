import React, { ChangeEvent, ForwardedRef, forwardRef, memo, MouseEvent, useCallback, useRef, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import useBoolean from 'v2/hooks/useBoolean';

import { EyeIcon, EyeSlashIcon } from 'components/icons';
import useOutsideClick from 'hooks/useOutsideClick';

import FormLabel from '../FormLabel';
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
  tooltip?: string;
  allowCyrillic?: boolean;
  options?: string[];
} & TextFieldProps;

const Input = ({
  showPasswordIcon, type, maxWidth,
  theme = 'white', label, className,
  tooltip, allowCyrillic = false, error,
  options = [], onChange, ...props
}: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const [value, setValue] = useState(props.value || props.defaultValue);
  const [showPassword, setShowPassword] = useState(false);
  const [isCyrillicError, setIsCyrillicError] = useState(false);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const nameCyrillicValidator = (e: any) => {
    if (!allowCyrillic) {
      function containsCyrillicCharacters (str: string): boolean {
        const cyrillicRegex = /[а-яА-Я]/;
        return cyrillicRegex.test(str);
      }
      if (containsCyrillicCharacters(e.key)) {
        setIsCyrillicError(true);
        e.preventDefault();
      } else {
        setIsCyrillicError(false);
      }
    }
  };

  const [possibleOptions, setPossibleOptions] = useState(options);
  const [isOpen, open, close] = useBoolean(false);

  const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e);
    setPossibleOptions(options.filter(o => o.toLowerCase().includes(e.target.value.toLowerCase())));
  }, [onChange, options]);

  const optionClickHandler = useCallback((option: string) => (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    changeHandler({ target: { value: option } } as any);
    setValue(option);
    close();
  }, [changeHandler, close]);

  const fieldRef = useRef<HTMLLabelElement >(null);
  useOutsideClick(fieldRef, close);

  return (
    <InputWrapper className={className} style={{ maxWidth }} fieldColor={COLORS_MAP[theme]} ref={fieldRef}>
      <FormLabel className={isCyrillicError || error ? ' error' : ''} tooltip={tooltip}>
        {label}
      </FormLabel>
      <TextField
        ref={ref}
        type={showPasswordIcon ? (showPassword ? 'text' : 'password') : type}
        onKeyPress={nameCyrillicValidator}
        error={error || isCyrillicError}
        {...(isCyrillicError ? { helperText: 'Iba latinka s diakritikou (Abc... + ˇ´)' } : {})}
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
        value={value}
        onChange={changeHandler}
        onClick={open}
        {...props}
      />
      {isOpen && !!options.length && (
        <div role="list" className="options" style={{ width: maxWidth }}>
          {possibleOptions.map(option => (
            <div role="listitem" key={option} onClick={optionClickHandler(option)} className="option">
              {option}
            </div>
          ))}
        </div>
      )}
    </InputWrapper>
  );
};
export default memo(forwardRef(Input));
