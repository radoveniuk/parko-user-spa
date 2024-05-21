import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import Skeleton from 'v2/uikit/Skeleton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { useGetPropertyMovements } from 'api/query/propertyMovementQuery';
import { ArrowUpIcon, DeleteIcon, EditIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { iterateMap } from 'helpers/iterateMap';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import { IClient } from 'interfaces/client.interface';
import { IPropertyMovement } from 'interfaces/propertyMovement.interface';
import { IUser } from 'interfaces/users.interface';

import { useColumns } from '../../contexts/ColumnsContext/useColumns';
import { useSelectedItems } from '../../contexts/SelectedItemsContext/useSelectedItems';
import { GiveDialog, ReturnDialog, WriteoffDialog } from '../../dialogs';
import usePropertyMovementActions from '../hooks/useMovementActions';

import { TableWrapper } from './styles';

type Props = {
  data: IPropertyMovement<true>[];
  isFetching?: boolean;
};

const Table = ({
  data,
  isFetching,
}: Props) => {
  const [activeCols] = useColumns();
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const { sortedData, sorting, sortingToggler } = useSortedList(data);

  const toggleSorting = (mKey: keyof IPropertyMovement<true>) => {
    let sortableKey: SortingValue<IPropertyMovement<true>> = mKey;
    if (mKey === 'user') {
      sortableKey = 'user.fullname';
    }
    if (mKey === 'createdBy') {
      sortableKey = 'createdBy.fullname';
    }
    if (mKey === 'updatedBy') {
      sortableKey = 'updatedBy.fullname';
    }
    if (mKey === 'recorder') {
      sortableKey = 'recorder.fullname';
    }
    if (mKey === 'client') {
      sortableKey = 'client.shortName';
    }
    if (mKey === 'contractor') {
      sortableKey = 'contractor.shortName';
    }
    if (mKey === 'project') {
      sortableKey = 'project.name';
    }
    sortingToggler(mKey, sortableKey);
  };

  // delete
  const { remove } = usePropertyMovementActions();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const generateCellContent = (rowData: IPropertyMovement<true>, col: keyof IPropertyMovement) => {
    if (['user', 'recorder', 'createdBy', 'updatedBy'].includes(col)) {
      const value = rowData[col] as IUser;
      return value?.fullname;
    }
    if (['createdAt', 'updatedAt'].includes(col)) {
      return getDateFromIso(rowData[col], 'dd.mm.yyyy HH:mm');
    }
    if (['client', 'contractor'].includes(col)) {
      const value = rowData[col] as IClient;
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
      return <StatusLabel className={rowData.userStatus}>{t(`selects.userStatus.${rowData.userStatus}`)}</StatusLabel>;
    }
    if (['userCooperationStartDate', 'date'].includes(col)) {
      return getDateFromIso(rowData[col] as string);
    }
    if (['receiver', 'createdBy', 'updatedBy'].includes(col)) {
      return (rowData[col] as IUser)?.fullname;
    }
    return rowData[col] as string | number;
  };

  const [activePropertyMovement, setActivePropertyMovement] = useState<IPropertyMovement<true> | null>(null);

  const { data: allMovements = [] } = useGetPropertyMovements();
  const checkFutureMovements = (movementId: string) => allMovements.some((movement) => movement.previousMovement?._id === movementId);

  // select items
  const [selectedItems, { toggle: toggleSelectedRow }] = useSelectedItems();

  const selectRowChangeHandler = useCallback((row: IPropertyMovement<true>) => () => {
    toggleSelectedRow(row);
  }, [toggleSelectedRow]);

  return (
    <TableWrapper>
      <ListTable
        columns={['', ...activeCols, '']}
        className="movements-table"
        columnComponent={(col) => {
          if (col) {
            return (
              <div
                role="button"
                className="col-item"
                onClick={() => void toggleSorting(col.replace('stock.', '') as keyof IPropertyMovement)}
              >
                {t(col)}
                <IconButton
                  className={
                    sorting?.key === (col.replace('stock.', '') as keyof IPropertyMovement)
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
        {sortedData.map((item) => (
          <ListTableRow key={item._id}>
            <ListTableCell>
              <Checkbox
                checked={selectedItems.some((selectedItem: IPropertyMovement<true>) => selectedItem._id === item._id)}
                onChange={selectRowChangeHandler(item)}
              />
            </ListTableCell>
            {activeCols.map((col) => (
              <ListTableCell key={col}>
                {generateCellContent(item, col.replace('stock.', '') as keyof IPropertyMovement<true>)}
              </ListTableCell>
            ))}
            <ListTableCell align="right">
              {permissions.includes('stock:update') && (
                <IconButton onClick={() => void setActivePropertyMovement(item)}><EditIcon /></IconButton>
              )}
              {permissions.includes('stock:delete') && (
                <IconButton onClick={() => void setIdToDelete(item._id)} disabled={checkFutureMovements(item._id)}><DeleteIcon /></IconButton>
              )}
            </ListTableCell>
          </ListTableRow>
        ))}
        {!sortedData.length && isFetching && (
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
      {activePropertyMovement?.type === 'give' && (
        <GiveDialog
          open={!!activePropertyMovement}
          onClose={() => void setActivePropertyMovement(null)}
          defaultData={activePropertyMovement}
        />
      )}
      {activePropertyMovement?.type === 'return' && (
        <ReturnDialog
          open={!!activePropertyMovement}
          onClose={() => void setActivePropertyMovement(null)}
          defaultData={activePropertyMovement}
        />
      )}
      {activePropertyMovement?.type === 'writeoff' && (
        <WriteoffDialog
          open={!!activePropertyMovement}
          onClose={() => void setActivePropertyMovement(null)}
          defaultData={activePropertyMovement}
        />
      )}
    </TableWrapper>
  );
};

export default memo(Table);
