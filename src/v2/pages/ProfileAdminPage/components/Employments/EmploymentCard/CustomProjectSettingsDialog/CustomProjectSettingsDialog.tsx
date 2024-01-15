import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'v2/uikit';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';

import { PlusIcon } from 'components/icons';
import { ProjectPosition } from 'interfaces/project.interface';

import { SettingsWrapper } from './styles';

type Props = DialogProps & {
  onSubmit(settings: Partial<ProjectPosition>): void;
}

const CustomProjectSettingsDialog = ({ onSubmit, ...rest }: Props) => {
  const { t } = useTranslation();
  return (
    <Dialog
      mobileFullscreen
      title={t('user.updateEmploymentInfo')}
      {...rest}
    >
      <SettingsWrapper>
        <Button variant="text">
          <PlusIcon size={16} /> {t('add')}
        </Button>
      </SettingsWrapper>
      <DialogActions>
        <Button variant="contained">{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomProjectSettingsDialog;
