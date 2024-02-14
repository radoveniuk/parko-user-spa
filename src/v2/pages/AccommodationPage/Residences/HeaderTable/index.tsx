import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, MenuItem, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { CheckInIcon, CheckOutIcon, ExcelIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import { useActiveResidence } from '../../contexts/ResidenceContext';
import CheckoutDialog from '../../dialogs/CheckoutDialog';

import { HeaderWrapper, MemuItemContent } from './styles';

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
                <Menu className="big-btn" isCloseOnMenu>
                  <MenuItem onClick={() => void setOpenResidence(true)}>
                    <MemuItemContent className="btn"><CheckInIcon size={20}/>Check in</MemuItemContent>
                  </MenuItem>
                  <MenuItem onClick={() => void setOpenCheckout(true)}>
                    <MemuItemContent className="btn"><CheckOutIcon size={20}/>Check out</MemuItemContent>
                  </MenuItem>
                  <Link to="/export-residences">
                    <MenuItem color="secondary">
                      <MemuItemContent className="export"><ExcelIcon size={20}/>{t('user.export')}</MemuItemContent>
                    </MenuItem>
                  </Link>
                </Menu>
                <IconButton className="small-btn primary" onClick={() => void setOpenResidence(true)}><CheckInIcon size={25} /></IconButton>
                <IconButton className="small-btn primary" onClick={() => void setOpenCheckout(true)}><CheckOutIcon size={25} /></IconButton>
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
