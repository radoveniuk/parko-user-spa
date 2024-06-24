import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import pick from 'lodash-es/pick';
import { useTableColumns } from 'v2/contexts/TableColumnsContext';
import { useTableSelectedItems } from 'v2/contexts/TableSelectedItemsContext';
import useBoolean from 'v2/hooks/useBoolean';
import { Button, Divider, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { ArrowDownIcon, CheckAllIcon, ExcelIcon, PlusIcon, RemoveCheckIcon, TableIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { useExportData } from 'hooks/useExportData';
import { AnyObject } from 'interfaces/base.types';
import { IProperty } from 'interfaces/property.interface';
import { IUser } from 'interfaces/users.interface';

import PropertyFormDialog from '../../dialogs/PropertyFormDialog';
import ColumnsConfig from '../ColumnsConfig';

type Props = {
  data: IProperty<true>[];
}

const HeaderTable = ({ data }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [isOpenCreateDialog, openCreateDialog, closeCreateDialog] = useBoolean(false);
  const [isOpenCols, openCols, closeCols] = useBoolean(false);

  // Export
  const [activeCols] = useTableColumns();
  const [selectedItems,, setSelectedItems] = useTableSelectedItems();

  const colsToExport = useMemo(() => activeCols.map((col: string) => col.replace('stock.', '')), [activeCols]);

  const propertiesToExport = useMemo(() => selectedItems.map((movement: IProperty<true>) => {
    const rowData: AnyObject = {};

    const getCellContent = (rowData: IProperty<true>, col: keyof IProperty) => {
      if (['invoiceDeliveryDate', 'deliveryDate'].includes(col)) {
        return getDateFromIso(rowData[col]);
      }
      if (['createdAt', 'updatedAt'].includes(col)) {
        return getDateFromIso(rowData[col], 'dd.mm.yyyy HH:mm');
      }
      if (col === 'status') {
        return t(`selects.propertyStatus.${rowData.status}`);
      }
      if (col === 'orderer') {
        return rowData.orderer.shortName;
      }
      if (['receiver', 'createdBy', 'updatedBy'].includes(col)) {
        return (rowData[col] as IUser)?.fullname;
      }
      return rowData[col] as string | number;
    };

    for (const col in movement) {
      rowData[col] = getCellContent(movement, col as keyof IProperty);
    }

    return pick(rowData, colsToExport) as Partial<IProperty>;
  }), [colsToExport, selectedItems, t]);

  const exportData = useExportData({
    data: propertiesToExport,
    colsToExport: colsToExport,
    cols: colsToExport,
    entity: 'stock',
  });

  return (
    <>
      <ListTableHeader title={`${t('stock.properties')}: ${data.length}`}>
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
