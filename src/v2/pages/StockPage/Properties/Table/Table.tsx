import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import Skeleton from 'v2/uikit/Skeleton';

import { useGetPropertyMovements } from 'api/query/propertyMovementQuery';
import { ArrowUpIcon, DeleteIcon, EditIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { iterateMap } from 'helpers/iterateMap';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import { IProperty } from 'interfaces/property.interface';
import { IUser } from 'interfaces/users.interface';

import { useColumns } from '../../contexts/ColumnsContext/useColumns';
import { useSelectedItems } from '../../contexts/SelectedItemsContext/useSelectedItems';
import PropertyFormDialog from '../../dialogs/PropertyFormDialog';
import usePropertyActions from '../hooks/usePropertyActions';

import { TableWrapper } from './styles';

type Props = {
  data: IProperty<true>[];
  isFetching?: boolean;
};

const Table = ({
  data,
  isFetching,
}: Props) => {
  const [activeCols] = useColumns();
  const { t } = useTranslation();

  const { sortedData: sortedProperties, sorting, sortingToggler } = useSortedList(data);

  const toggleSorting = (propertKey: string) => {
    sortingToggler(propertKey, propertKey as SortingValue<IProperty<true>>);
  };
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const { data: movements = [] } = useGetPropertyMovements();

  const { permissions } = useAuthData();

  const generateCellContent = (rowData: IProperty<true>, col: keyof IProperty) => {
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

  const [activeProperty, setActiveProperty] = useState<IProperty<true> | null>(null);
  const { remove } = usePropertyActions();

  // select items
  const [selectedItems, { toggle: toggleSelectedRow }] = useSelectedItems();

  const selectRowChangeHandler = useCallback((row: IProperty<true>) => () => {
    toggleSelectedRow(row);
  }, [toggleSelectedRow]);

  return (
    <TableWrapper>
      <ListTable
        columns={['', ...activeCols, '']}
        className="properties-table"
        columnComponent={(col) => {
          if (col) {
            return (
              <div
                role="button"
                className="col-item"
                onClick={() => void toggleSorting(col.replace('stock.', '') as keyof IProperty)}
              >
                {t(col)}
                <IconButton
                  className={
                    sorting?.key === (col.replace('stock.', '') as keyof IProperty)
                      ? `sort-btn active ${sorting.dir}`
                      : 'sort-btn'
                  }
                >
                  <ArrowUpIcon />
                </IconButton>
              </div>
            );
          }
        }}
      >
        {sortedProperties.map((property) => (
          <ListTableRow key={property._id}>
            <ListTableCell>
              <Checkbox
                checked={selectedItems.some((selectedItem: IProperty<true>) => selectedItem._id === property._id)}
                onChange={selectRowChangeHandler(property)}
              />
            </ListTableCell>
            {activeCols.map((col) => (
              <ListTableCell key={col}>
                {generateCellContent(property, col.replace('stock.', '') as keyof IProperty)}
              </ListTableCell>
            ))}
            <ListTableCell align="right">
              {permissions.includes('stock:update') && (
                <IconButton onClick={() => void setActiveProperty(property)}><EditIcon /></IconButton>
              )}
              {permissions.includes('stock:delete') && (
                <IconButton
                  onClick={() => void setIdToDelete(property._id)}
                  disabled={movements.some((movement) => movement.property._id === property._id)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </ListTableCell>
          </ListTableRow>
        ))}
        {!sortedProperties.length && isFetching && (
          iterateMap(20, (index) => (
            <ListTableRow key={index}>
              {activeCols.map((emptyCol, emptyColIndex) => (
                <ListTableCell key={emptyCol + emptyColIndex}><Skeleton /></ListTableCell>
              ))}
            </ListTableRow>
          ))
        )}
      </ListTable>
      <DialogConfirm
        onClose={() => void setIdToDelete(null)}
        open={!!idToDelete}
        onSubmit={() => {
          remove(idToDelete as string);
          setIdToDelete(null);
        }}
      />
      {!!activeProperty && (
        <PropertyFormDialog
          defaultData={activeProperty}
          open={!!activeProperty}
          onClose={() => void setActiveProperty(null)}
        />
      )}
    </TableWrapper>
  );
};

export default memo(Table);
