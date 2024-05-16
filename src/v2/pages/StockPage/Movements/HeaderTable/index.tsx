import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { ArrowDownIcon, BackIcon, CheckInIcon, DeleteIcon, ExcelIcon, ForwardIcon, ThreeDotsIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { PropertyMovementType } from 'interfaces/propertyMovement.interface';

import MovementFormDialog from '../../dialogs/MovementFormDialog';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [openMovement, setOpenMovement] = useState<null | PropertyMovementType>(null);

  return (
    <>
      <ListTableHeader title={`${t('stock.movements')}: ${count}`}>
        <div className="link">
          <Menu
            isCloseOnMenu
            menuComponent={(
              <>
                <Button className="big-btn">
                  <div className="text">{t('fastActions')}</div>
                  <ArrowDownIcon className="big-icon" />
                </Button>
                <IconButton className="small-btn primary"><ThreeDotsIcon size={25} /></IconButton>
              </>
            )}
          >
            {permissions.includes('stock:update') && (
              <MenuItem color="primary" onClick={() => { setOpenMovement('give'); }}>
                <ForwardIcon size={20}/>{t('selects.propertyMovementType.give')}
              </MenuItem>
            )}
            {permissions.includes('stock:update') && (
              <MenuItem color="primary" onClick={() => { setOpenMovement('return'); }}>
                <BackIcon size={20}/>{t('selects.propertyMovementType.return')}
              </MenuItem>
            )}
            {permissions.includes('stock:update') && (
              <MenuItem color="error" onClick={() => { setOpenMovement('writeoff'); }}>
                <DeleteIcon size={20}/>{t('selects.propertyMovementType.writeoff')}
              </MenuItem>
            )}
            <Divider />
            <MenuItem color="#1e6e43" onClick={() => {}}>
              <ExcelIcon size={20}/>{t('user.export')}
            </MenuItem>
          </Menu>
          {permissions.includes('residences:create') && (
            <IconButton className="small-btn primary" onClick={() => {}}><CheckInIcon size={25} /></IconButton>
          )}
        </div>
      </ListTableHeader>
      {!!openMovement && (
        <MovementFormDialog
          type={openMovement}
          open={!!openMovement}
          onClose={() => void setOpenMovement(null)}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
