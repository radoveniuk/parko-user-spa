import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import { useActiveAccommodation } from '../../contexts/AccommodationContext';
import CheckoutDialog from '../../dialogs/CheckoutDialog';

import { HeaderWrapper } from './styles';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { role } = useAuthData();

  const [openCheckout, setOpenCheckout] = useState(false);
  const [, setOpenAccommodation] = useActiveAccommodation();

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('accommodation.objects')}: {count}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <div className="link">
            {role === 'admin' && (
              <>
                <Button className="big-btn" onClick={() => void setOpenAccommodation(true)}><PlusIcon size={20}/>{t('accommodation.create')}</Button>
                <IconButton className="small-btn primary" onClick={() => void setOpenAccommodation(true)}><PlusIcon size={25} /></IconButton>
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
