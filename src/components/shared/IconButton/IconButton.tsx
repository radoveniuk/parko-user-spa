import React, { ForwardedRef, forwardRef } from 'react';
import { IconButton as IconButtonMaterial, IconButtonProps } from '@mui/material';

const IconButton = forwardRef(({ children, ...rest }: IconButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  return (
    <IconButtonMaterial
      {...rest}
      ref={ref}
    >
      {children}
    </IconButtonMaterial>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
