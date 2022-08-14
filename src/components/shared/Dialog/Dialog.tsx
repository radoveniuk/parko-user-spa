import React from 'react';
import { Dialog as DialogMaterial, DialogContent, DialogProps } from '@mui/material';
import { CloseIcon } from 'components/icons';
import IconButton from '../IconButton';
import { DialogTitle } from './styles';

export type Props = DialogProps & {
  onClose(): void;
}

const Dialog = ({ children, title, onClose, ...rest }: Props) => (
  <DialogMaterial onClose={onClose} {...rest}>
    <DialogTitle>
      {title}
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent>
      {children}
    </DialogContent>
  </DialogMaterial>
);

export default Dialog;
