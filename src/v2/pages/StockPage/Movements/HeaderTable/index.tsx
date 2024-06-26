import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import pick from 'lodash-es/pick';
import { useTableColumns } from 'v2/contexts/TableColumnsContext';
import { useTableSelectedItems } from 'v2/contexts/TableSelectedItemsContext';
import useBoolean from 'v2/hooks/useBoolean';
import { Button, Divider, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import {
  ArrowDownIcon, CheckAllIcon, ExcelIcon, FileIcon, GiveUserIcon,
  RemoveCheckIcon, ReturnFromUserIcon, TableIcon, ThreeDotsIcon, UnboxIcon,
} from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { useExportData } from 'hooks/useExportData';
import { AnyObject } from 'interfaces/base.types';
import { IClient } from 'interfaces/client.interface';
import { IPropertyMovement, PropertyMovementType } from 'interfaces/propertyMovement.interface';
import { IUser } from 'interfaces/users.interface';

import { GiveDialog, PrintDocDialog, ReturnDialog, WriteoffDialog } from '../../dialogs';
import ColumnsConfig from '../ColumnsConfig';

type Props = { data: IPropertyMovement<true>[]; }

const HeaderTable = ({ data }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  // Export
  const [activeCols] = useTableColumns();
  const [selectedItems,, setSelectedItems] = useTableSelectedItems<IPropertyMovement<true>>();

  const colsToExport = useMemo(() => activeCols.map((col: string) => col.replace('stock.', '')), [activeCols]);

  const movementsToExport = useMemo(() => selectedItems.map((movement) => {
    const rowData: AnyObject = {};

    const getCellContent = (rowData: IPropertyMovement<true>, col: string) => {
      if (['user', 'recorder', 'createdBy', 'updatedBy'].includes(col)) {
        const value = rowData[col as keyof typeof rowData] as IUser;
        return value?.fullname;
      }
      if (['createdAt', 'updatedAt'].includes(col)) {
        return getDateFromIso(rowData[col as keyof typeof rowData], 'dd.mm.yyyy HH:mm');
      }
      if (['client', 'contractor'].includes(col)) {
        const value = rowData[col as keyof typeof rowData] as IClient;
        return value?.shortName;
      }
      if (col === 'project') {
        return rowData.project?.name;
      }
      if (col === 'property') {
        return rowData.property.internalName;
      }
      if (col === 'type') {
        return t(`selects.propertyMovementType.${rowData.type}`);
      }
      if (col === 'writeoffReason') {
        return rowData.writeoffReason ? t(`selects.writeOffReason.${rowData.writeoffReason}`) : '';
      }
      if (col === 'userStatus') {
        return t(`selects.userStatus.${rowData.userStatus}`);
      }
      if (col === 'userWorkTypes') {
        return rowData.userWorkTypes.map(wt => t(`selects.userWorkType.${wt}`)).join(',');
      }
      if (col === 'distributorName') {
        return rowData.property.distributorName;
      }
      if (col === 'distributorICO') {
        return rowData.property.distributorICO;
      }
      if (col === 'price') {
        return `${rowData.property.price.toFixed(2).toString().replace('.', ',')} €`;
      }
      if (['userCooperationStartDate', 'userCooperationEndDate', 'date'].includes(col)) {
        return getDateFromIso(rowData[col as keyof typeof rowData] as string);
      }
      if (['receiver', 'createdBy', 'updatedBy'].includes(col)) {
        return (rowData[col as keyof typeof rowData] as IUser)?.fullname;
      }
      return rowData[col as keyof typeof rowData] as string | number;
    };

    activeCols.forEach((c) => {
      const col = c.replace('stock.', '');
      rowData[col] = getCellContent(movement, col);
    });

    return pick(rowData, colsToExport) as Partial<IPropertyMovement>;
  }), [activeCols, colsToExport, selectedItems, t]);

  console.log(movementsToExport);

  const exportData = useExportData({
    data: movementsToExport,
    colsToExport: colsToExport,
    cols: colsToExport,
    entity: 'stock',
  });

  const [openMovement, setOpenMovement] = useState<null | PropertyMovementType>(null);
  const [isOpenCols, openCols, closeCols] = useBoolean(false);
  const [isOpenPrint, openPrint, closePrint] = useBoolean(false);

  return (
    <>
      <ListTableHeader title={`${t('stock.movements')}: ${data.length}`}>
        <div className="link">
          <Menu
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
            <MenuItem color="primary" disabled={!selectedItems.length} onClick={openPrint}>
              <FileIcon size={20} />
              {t('docsTemplates.print')}
            </MenuItem>
            <MenuItem color="#1e6e43" onClick={() => void exportData('xlsx')}>
              <ExcelIcon size={20}/>{t('user.export')}
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
      {isOpenCols && (
        <ColumnsConfig
          onClose={closeCols}
          open={isOpenCols}
        />
      )}
      {isOpenPrint && (
        <PrintDocDialog
          onClose={closePrint}
          open={isOpenPrint}
          movements={selectedItems}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
