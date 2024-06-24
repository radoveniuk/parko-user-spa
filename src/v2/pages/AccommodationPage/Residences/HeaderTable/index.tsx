import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import pick from 'lodash-es/pick';
import { useTableColumns } from 'v2/contexts/TableColumnsContext';
import { useTableSelectedItems } from 'v2/contexts/TableSelectedItemsContext';
import useBoolean from 'v2/hooks/useBoolean';
import { Button, Divider, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { ArrowDownIcon, CheckAllIcon, CheckInIcon, CheckOutIcon, ExcelIcon, RemoveCheckIcon, TableIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { useExportData } from 'hooks/useExportData';
import { AnyObject } from 'interfaces/base.types';
import { IResidence } from 'interfaces/residence.interface';

import { useActiveResidence } from '../../contexts/ResidenceContext';
import CheckoutDialog from '../../dialogs/CheckoutDialog';
import ColumnsConfig from '../ColumnsConfig';
import useGetTableCellContent, { TableColumnKey } from '../hooks/useGetTableCellContent';

import { MenuItemContent } from './styles';

type Props = {
  data: IResidence[];
}

const HeaderTable = ({ data }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [openCheckout, setOpenCheckout] = useState(false);
  const [, setOpenResidence] = useActiveResidence();

  // cols
  const [isOpenCols, openCols, closeCols] = useBoolean(false);

  // Export
  const [activeCols] = useTableColumns();
  const [selectedItems,, setSelectedItems] = useTableSelectedItems();

  const colsToExport = useMemo(() => activeCols.map((col: string) => col.replace('accommodation.', '')), [activeCols]);

  const getCellContent = useGetTableCellContent();

  const propertiesToExport = useMemo(() => selectedItems.map((residence: IResidence) => {
    const rowData: AnyObject = {};

    colsToExport.forEach((col) => {
      rowData[col] = getCellContent(residence, col as TableColumnKey);
    });

    return pick(rowData, colsToExport) as Partial<IResidence>;
  }), [colsToExport, getCellContent, selectedItems]);

  const exportData = useExportData({
    data: propertiesToExport,
    colsToExport: colsToExport,
    cols: colsToExport,
    entity: 'accommodation',
  });

  return (
    <>
      <ListTableHeader title={`${t('accommodation.residences')}: ${data.length}`}>
        <div className="link">
          <Menu
            className="big-btn"
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
            <Divider />
            <MenuItem onClick={() => void setSelectedItems(data)}>
              <CheckAllIcon size={20} />
              {t('selectAll')}
            </MenuItem>
            <MenuItem disabled={!selectedItems.length} onClick={() => void setSelectedItems([])}>
              <RemoveCheckIcon size={20} />
              {t('removeSelect')}
            </MenuItem>
            <MenuItem onClick={openCols}>
              <TableIcon size={20} />{t('cols')}
            </MenuItem>
            <Divider />
            <MenuItem color="#1e6e43" onClick={() => void exportData('xlsx')}>
              <ExcelIcon size={20}/>{t('user.export')}
            </MenuItem>
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
      {isOpenCols && (
        <ColumnsConfig
          onClose={closeCols}
          open={isOpenCols}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
