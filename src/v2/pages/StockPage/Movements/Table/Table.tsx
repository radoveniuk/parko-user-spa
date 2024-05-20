import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useFilters } from 'v2/components/Filters';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import Skeleton from 'v2/uikit/Skeleton';

import { useDeleteResidence } from 'api/mutations/residenceMutation';
import { ArrowUpIcon, DeleteIcon, EditIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { iterateMap } from 'helpers/iterateMap';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import { IClient } from 'interfaces/client.interface';
import { IPropertyMovement } from 'interfaces/propertyMovement.interface';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import { GiveDialog, ReturnDialog, WriteoffDialog } from '../../dialogs';

import { TableWrapper } from './styles';

type Props = {
  activeCols: string[];
  data: IPropertyMovement<true>[];
  isFetching?: boolean;
};

const Table = ({
  activeCols,
  data,
  isFetching,
}: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();
  const queryClient = useQueryClient();
  const { filtersState } = useFilters();

  const { sortedData, sorting, sortingToggler } = useSortedList(data);

  const toggleSorting = (mKey: string) => {
    // sortingToggler(mKey, mKey as string);
  };
  const deleteResidence = useDeleteResidence();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const generateCellContent = (rowData: IPropertyMovement<true>, col: keyof IPropertyMovement) => {
    if (['user', 'recorder', 'createdBy', 'updatedBy'].includes(col)) {
      const value = rowData[col] as IUser;
      return value.fullname;
    }
    if (['client', 'contractor'].includes(col)) {
      const value = rowData[col] as IClient;
      return value.shortName;
    }
    if (col === 'project') {
      return rowData.project.name;
    }
    if (col === 'property') {
      return rowData.property.internalName;
    }
    if (col === 'type') {
      return t(`selects.propertyMovementType.${rowData.type}`);
    }
    if (col === 'userCooperationType') {
      return t(`selects.userCooperationType.${rowData.userCooperationType}`);
    }
    if (col === 'userStatus') {
      return t(`selects.userStatus.${rowData.userStatus}`);
    }
    if (['userCooperationStartDate', 'date'].includes(col)) {
      return getDateFromIso(rowData[col] as string);
    }
    if (['receiver', 'createdBy', 'updatedBy'].includes(col)) {
      return (rowData[col] as IUser).fullname;
    }
    return rowData[col] as string | number;
  };

  const [activePropertyMovement, setActivePropertyMovement] = useState<IPropertyMovement<true> | null>(null);

  return (
    <TableWrapper>
      <ListTable
        columns={[...activeCols, '']}
        className="residences-table"
        columnComponent={(col) => {
          if (col) {
            return (
              <div
                role="button"
                className="col-item"
                onClick={() => void toggleSorting(col.replace('prepayment.', '') as keyof IClient)}
              >
                {t(col)}
                <IconButton
                  className={
                    sorting?.key === (col.replace('client.', '') as keyof IUser)
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
                <IconButton onClick={() => void setIdToDelete(item._id)}><DeleteIcon /></IconButton>
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
          const prevAccommodations = queryClient.getQueryData(['residences', JSON.stringify(filtersState)]) as IResidence[];
          queryClient.setQueryData(['residences', JSON.stringify(filtersState)], prevAccommodations.filter((item) => item._id !== idToDelete));
          setIdToDelete(null);
          deleteResidence.mutate(idToDelete as string);
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
