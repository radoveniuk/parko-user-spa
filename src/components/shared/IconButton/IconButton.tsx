import React, { ForwardedRef, forwardRef, HTMLProps, PropsWithChildren } from 'react';
import { IconButtonWrapper } from './styles';

const IconButton = forwardRef(({ children, ...rest }: PropsWithChildren<HTMLProps<HTMLButtonElement>>, ref: ForwardedRef<HTMLButtonElement>) => {
  return (
    <IconButtonWrapper>
      <button
        {...rest}
        ref={ref}
        type="button"
      >
        {children}
      </button>
    </IconButtonWrapper>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
