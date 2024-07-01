import React, { ForwardedRef, forwardRef, memo } from 'react';
import { IconButtonProps } from '@mui/material';

import { StyledIconButton } from './styles';

const IconButton = forwardRef(({ children, ...rest }: IconButtonProps, ref: ForwardedRef<HTMLButtonElement>) => (
  <StyledIconButton
    {...rest}
    ref={ref}
  >
    {children}
  </StyledIconButton>
));

IconButton.displayName = 'IconButton';

export default memo(IconButton);
