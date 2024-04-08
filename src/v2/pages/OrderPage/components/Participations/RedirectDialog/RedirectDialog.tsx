import React, { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from 'v2/uikit';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';

import { IUser } from 'interfaces/users.interface';

import { MessageWrapper } from './styles';

const RedirectDialog = ({ user, ...props }: DialogProps & { user: Pick<IUser, 'fullname' | '_id'> }) => {
  const { t } = useTranslation();
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
        <Link to={`/profile/${user._id}`} state={{ tab: 3 }}>
          <Button variant="contained">{t('go')}</Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
};

export default memo(RedirectDialog);
