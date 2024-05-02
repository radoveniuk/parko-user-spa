import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import { useActiveAccommodation } from '../../contexts/AccommodationContext';
import CheckoutDialog from '../../dialogs/CheckoutDialog';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [openCheckout, setOpenCheckout] = useState(false);
  const [, setOpenAccommodation] = useActiveAccommodation();

  return (
    <>
      <ListTableHeader title={`${t('accommodation.objects')}: ${count}`}>
        {permissions.includes('accommodations:create') && (
          <>
            <Button className="big-btn" onClick={() => void setOpenAccommodation(true)}><PlusIcon size={20}/>{t('accommodation.create')}</Button>
            <IconButton className="small-btn primary" onClick={() => void setOpenAccommodation(true)}><PlusIcon size={25} /></IconButton>
          </>
        )}
      </ListTableHeader>
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
