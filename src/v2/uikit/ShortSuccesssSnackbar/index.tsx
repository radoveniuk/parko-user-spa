import React, { forwardRef, useCallback } from 'react';
import { SnackbarContent, SnackbarContentProps, useSnackbar } from 'notistack';

import { CheckIcon } from 'components/icons';

import { CheckmarkWrapper } from './styles';

interface Props extends SnackbarContentProps {
}

const ShortSuccesssSnackbar = forwardRef<HTMLDivElement, Props>(
  ({ id, ...props }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
      <SnackbarContent ref={ref} {...props}>
        <CheckmarkWrapper onClick={handleDismiss}>
          <CheckIcon color="#fff" size={24} />
        </CheckmarkWrapper>
      </SnackbarContent>
    );
  },
);

ShortSuccesssSnackbar.displayName = 'ShortSuccesssSnackbar';

export default ShortSuccesssSnackbar;
