import React from 'react';
import { useTranslation } from 'react-i18next';

import Dialog, { DialogProps } from '../Dialog';
import Button from '../Button';

import { DialogContent } from './styles';

export type Props = DialogProps & {
  onSubmit(): void
}

const DialogConfirm = ({ onSubmit, title, onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  return (
    <Dialog
      title={title || t('deleteApprove')}
      onClose={onClose}
      {...rest}
    >
      <DialogContent>
        <Button color="error" variant="outlined" onClick={onSubmit}>{t('true')}</Button>
        <Button color="primary" variant="outlined" onClick={onClose}>{t('false')}</Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogConfirm;
