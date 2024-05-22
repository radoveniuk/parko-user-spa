import React from 'react';
import { useTranslation } from 'react-i18next';

import { WarningIcon } from 'components/icons';

import Button from '../Button';
import Dialog, { DialogActions, DialogProps } from '../Dialog';

import { DialogContent } from './styles';

export type Props = DialogProps & {
  onSubmit(): void
}

const DialogConfirm = ({ onSubmit, title, onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  if (!rest.open) return null;
  return (
    <Dialog
      title={title || t('confirmation')}
      onClose={onClose}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onSubmit();
        }
      }}
      color="#ff9800"
      {...rest}
    >
      <DialogContent>
        <div className="msg">
          <WarningIcon size={32}/>
          <div className="text">
            {t('areYouSureMsg')}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="error" variant="outlined" onClick={onSubmit}>{t('true')}</Button>
        <Button color="inherit" variant="contained" onClick={onClose}>{t('false')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConfirm;
