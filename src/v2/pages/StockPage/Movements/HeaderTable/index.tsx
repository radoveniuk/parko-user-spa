import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useBoolean from 'v2/hooks/useBoolean';
import { Button, Divider, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { ArrowDownIcon, ExcelIcon, GiveUserIcon, ReturnFromUserIcon, TableIcon, ThreeDotsIcon, UnboxIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { PropertyMovementType } from 'interfaces/propertyMovement.interface';

import { GiveDialog, ReturnDialog, WriteoffDialog } from '../../dialogs';
import ColumnsConfig from '../ColumnsConfig';

type Props = { count: number; }

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [openMovement, setOpenMovement] = useState<null | PropertyMovementType>(null);
  const [isOpenCols, openCols, closeCols] = useBoolean(false);

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
                <GiveUserIcon size={20}/>{t('selects.propertyMovementType.give')}
              </MenuItem>
            )}
            {permissions.includes('stock:update') && (
              <MenuItem color="primary" onClick={() => { setOpenMovement('return'); }}>
                <ReturnFromUserIcon size={20}/>{t('selects.propertyMovementType.return')}
              </MenuItem>
            )}
            {permissions.includes('stock:update') && (
              <MenuItem color="error" onClick={() => { setOpenMovement('writeoff'); }}>
                <UnboxIcon size={20}/>{t('selects.propertyMovementType.writeoff')}
              </MenuItem>
            )}
            <Divider />
            <MenuItem color="#1e6e43" onClick={() => {}}>
              <ExcelIcon size={20}/>{t('user.export')}
            </MenuItem>
            <Divider />
            <MenuItem onClick={openCols}>
              <TableIcon size={20} />{t('columns')}
            </MenuItem>
          </Menu>
        </div>
      </ListTableHeader>
      {openMovement === 'give' && (
        <GiveDialog
          open={!!openMovement}
          onClose={() => void setOpenMovement(null)}
        />
      )}
      {openMovement === 'return' && (
        <ReturnDialog
          open={!!openMovement}
          onClose={() => void setOpenMovement(null)}
        />
      )}
      {openMovement === 'writeoff' && (
        <WriteoffDialog
          open={!!openMovement}
          onClose={() => void setOpenMovement(null)}
        />
      )}
      {!!isOpenCols && (
        <ColumnsConfig
          onClose={closeCols}
          open={isOpenCols}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
