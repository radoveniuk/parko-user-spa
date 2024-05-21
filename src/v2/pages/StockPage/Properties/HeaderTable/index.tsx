import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import useBoolean from 'v2/hooks/useBoolean';
import { Button, Divider, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { ArrowDownIcon, PlusIcon, TableIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import PropertyFormDialog from '../../dialogs/PropertyFormDialog';
import ColumnsConfig from '../ColumnsConfig';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [isOpenCreateDialog, openCreateDialog, closeCreateDialog] = useBoolean(false);
  const [isOpenCols, openCols, closeCols] = useBoolean(false);

  return (
    <>
      <ListTableHeader title={`${t('stock.properties')}: ${count}`}>
        {permissions.includes('stock:create') && (
          <>
            <Menu
              isCloseOnMenu
              menuComponent={(
                <>
                  <Button className="big-btn">
                    <div className="text">{t('fastActions')}</div>
                    <ArrowDownIcon className="big-icon" />
                  </Button>
                </>
              )}
            >
              <MenuItem color="primary" onClick={openCreateDialog}>
                <PlusIcon size={20}/>{t('stock.createProperty')}
              </MenuItem>
              <Divider />
              <MenuItem onClick={openCols}>
                <TableIcon size={20} />{t('columns')}
              </MenuItem>
            </Menu>
            <IconButton className="small-btn primary" onClick={openCreateDialog}><PlusIcon size={25} /></IconButton>
          </>
        )}
      </ListTableHeader>
      {!!isOpenCreateDialog && (
        <PropertyFormDialog
          onClose={closeCreateDialog}
          open={isOpenCreateDialog}
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
