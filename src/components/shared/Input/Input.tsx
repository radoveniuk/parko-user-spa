import React, { ForwardedRef, forwardRef, HTMLProps } from 'react';
import { InputWrapper } from './styles';

type Props = HTMLProps<HTMLInputElement> & {
  title: string;
  error?: string;
}

const NOT_NUMBER_VALUES = ['e', 'E', '+', '-', '.', '.'];

const Input = forwardRef(({ title, type, error, ...rest }: Props, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <InputWrapper>
      <input
        ref={ref}
        placeholder=" "
        type={type}
        onKeyDown={(e) => {
          if (type === 'number') {
            if (NOT_NUMBER_VALUES.includes(e.key)) {
              e.preventDefault();
            }
          }
        }}
        {...rest}
      />
      <label>{title}</label>
      {error && <span className="error-text">{error}</span>}
    </InputWrapper>
  );
});

Input.displayName = 'Input';

export default Input;
