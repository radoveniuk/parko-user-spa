import React, { ForwardedRef, forwardRef, HTMLProps, PropsWithChildren } from 'react';
import { ButtonWrapper } from './styles';

type Props = PropsWithChildren<HTMLProps<HTMLButtonElement>> & {
  type: 'button' | 'submit' | 'reset';
}

const Button = forwardRef(({ children, ...rest }: Props, ref: ForwardedRef<HTMLButtonElement>) => {
  return (
    <ButtonWrapper className="button-wrapper">
      <button
        ref={ref}
        {...rest}
      >
        {children}
      </button>
    </ButtonWrapper>
  );
});

Button.displayName = 'Button';

export default Button;
