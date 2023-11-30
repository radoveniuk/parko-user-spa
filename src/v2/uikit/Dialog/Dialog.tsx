import React, { memo } from 'react';
import { Dialog as DialogMaterial, DialogActions as DialogActionsMaterial, DialogProps } from '@mui/material';

import { CloseIcon } from 'components/icons';
import useViewportWidth from 'hooks/useViewportWsdth';
import { SM } from 'theme/sizeBreakpoints';

import IconButton from '../../../v2/uikit/IconButton';

import { DialogContent, DialogTitle } from './styles';

export type Props = DialogProps & {
  onClose(): void;
  mobileFullscreen?: boolean;
}

const Dialog = ({ children, title, onClose, mobileFullscreen = false, ...rest }: Props) => {
  const viewportWidth = useViewportWidth();
  return (
    <DialogMaterial {...rest} onClose={onClose} fullScreen={rest.fullScreen || (mobileFullscreen && viewportWidth <= Number(SM.replace('px', '')))}>
      <DialogTitle>
        {title}
        <IconButton onClick={onClose}>
          <CloseIcon size={20} color="#fff" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </DialogMaterial>
  );
};

export default memo(Dialog);

export const DialogActions = DialogActionsMaterial;
