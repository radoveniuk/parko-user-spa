import React from 'react';
import { Dialog as DialogMaterial, DialogActions as DialogActionsMaterial, DialogProps } from '@mui/material';

import { CloseIcon } from 'components/icons';

import IconButton from '../../../v2/uikit/IconButton';

import { DialogContent, DialogTitle } from './styles';

export type Props = DialogProps & {
  onClose(): void;
}

const Dialog = ({ children, title, onClose, ...rest }: Props) => (
  <DialogMaterial onClose={onClose} {...rest}>
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

export default Dialog;

export const DialogActions = DialogActionsMaterial;
