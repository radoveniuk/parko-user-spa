import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { CheckInIcon, CheckOutIcon, ExcelIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import { useActiveResidence } from '../../contexts/ResidenceContext';
import CheckoutDialog from '../../dialogs/CheckoutDialog';

import { MenuItemContent } from './styles';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [openCheckout, setOpenCheckout] = useState(false);
  const [, setOpenResidence] = useActiveResidence();

  return (
    <>
      <ListTableHeader title={`${t('accommodation.residences')}: ${count}`}>
        <div className="link">
          <Menu className="big-btn" isCloseOnMenu>
            {permissions.includes('residences:create') && (
              <MenuItem onClick={() => void setOpenResidence(true)}>
                <MenuItemContent className="btn"><CheckInIcon size={20}/>Check in</MenuItemContent>
              </MenuItem>
            )}
            {permissions.includes('residences:update') && (
              <MenuItem onClick={() => void setOpenCheckout(true)}>
                <MenuItemContent className="btn"><CheckOutIcon size={20}/>Check out</MenuItemContent>
              </MenuItem>
            )}
            <Link to="/export-residences">
              <MenuItem color="secondary">
                <MenuItemContent className="export"><ExcelIcon size={20}/>{t('user.export')}</MenuItemContent>
              </MenuItem>
            </Link>
          </Menu>
          {permissions.includes('residences:create') && (
            <IconButton className="small-btn primary" onClick={() => void setOpenResidence(true)}><CheckInIcon size={25} /></IconButton>
          )}
          {permissions.includes('residences:update') && (
            <IconButton className="small-btn primary" onClick={() => void setOpenCheckout(true)}><CheckOutIcon size={25} /></IconButton>
          )}
        </div>
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
