import React, { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { Button } from 'v2/uikit';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import { useTabs } from 'v2/uikit/Tabs';

import { IUser } from 'interfaces/users.interface';

import { MessageWrapper } from './styles';

const RedirectDialog = ({ ...props }: DialogProps) => {
  const { t } = useTranslation();
  const [, setTab] = useTabs();
  const { id: userId } = useParams();
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(['user-data', userId]) as IUser;

  return (
    <Dialog {...props} title={t('order.redirectToEmploymentMsgTitle')}>
      <MessageWrapper>
        <Trans
          t={t}
          i18nKey="order.redirectToEmploymentMsgText"
          values={{ user: user.fullname }}
          components={{ b: <strong /> }}
        />
      </MessageWrapper>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={props.onClose}>{t('later')}</Button>
        <Button variant="contained" onClick={() => { setTab(2); props.onClose(); }}>{t('go')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(RedirectDialog);
