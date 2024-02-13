import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { CheckInIcon, CheckOutIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import { useActiveResidence } from '../../contexts/ResidenceContext';
import CheckoutDialog from '../../dialogs/CheckoutDialog';

import { HeaderWrapper } from './styles';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { role } = useAuthData();

  const [openCheckout, setOpenCheckout] = useState(false);
  const [, setOpenResidence] = useActiveResidence();

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('accommodation.residences')}: {count}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <div className="link">
            {role === 'admin' && (
              <>
                <IconButton className="small-btn primary" onClick={() => void setOpenResidence(true)}><CheckInIcon size={25} /></IconButton>
                <IconButton className="small-btn primary" onClick={() => void setOpenCheckout(true)}><CheckOutIcon size={25} /></IconButton>
                <Button className="big-btn" onClick={() => void setOpenResidence(true)}><CheckInIcon size={20}/>CheckIn</Button>
                <Button className="big-btn" onClick={() => void setOpenCheckout(true)}><CheckOutIcon size={20}/>CheckOut</Button>
              </>
            )}
          </div>
        </Stack>
      </HeaderWrapper>
      {openCheckout && (
        <CheckoutDialog
          open={!!openCheckout}
          onClose={() => void setOpenCheckout(false)}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
