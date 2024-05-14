import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import Skeleton from 'v2/uikit/Skeleton';

import { useDeleteAccommodation } from 'api/mutations/accommodationMutation';
import { ArrowUpIcon, DeleteIcon, EditIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { iterateMap } from 'helpers/iterateMap';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IClient } from 'interfaces/client.interface';
import { IProperty } from 'interfaces/property.interface';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import { TableWrapper } from './styles';

type Props = {
  activeCols: string[];
  data: IProperty<true>[];
  isFetching?: boolean;
};

const Table = ({
  activeCols,
  data,
  isFetching,
}: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { sortedData: sortedAccommodations, sorting, sortingToggler } = useSortedList(data);

  const toggleSorting = (propertKey: string) => {
    sortingToggler(propertKey, propertKey as SortingValue<IProperty<true>>);
  };
  const deleteAccommodation = useDeleteAccommodation();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const residences: IResidence[] = queryClient.getQueryData(['residences', JSON.stringify({})]) || [];

  const { permissions } = useAuthData();

  const generateCellContent = (rowData: IProperty<true>, col: keyof IProperty) => {
    if (['invoiceDeliveryDate', 'deliveryDate'].includes(col)) {
      return getDateFromIso(rowData[col]);
    }
    if (col === 'status') {
      return t(`selects.propertyStatus.${rowData.status}`);
    }
    if (col === 'orderer') {
      return rowData.orderer.shortName;
    }
    if (['receiver', 'createdBy', 'updatedBy'].includes(col)) {
      return (rowData[col] as IUser).fullname;
    }
    return rowData[col] as string | number;
  };

  return (
    <TableWrapper>
      <ListTable
        columns={[...activeCols, '']}
        className="properties-table"
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
        {sortedAccommodations.map((item) => (
          <ListTableRow key={item._id}>
            {activeCols.map((col) => (
              <ListTableCell key={col}>
                {generateCellContent(item, col.replace('stock.', '') as keyof IProperty)}
              </ListTableCell>
            ))}
            <ListTableCell align="right">
              {permissions.includes('stock:update') && (
                <IconButton onClick={() => void {}}><EditIcon /></IconButton>
              )}
              {permissions.includes('stock:delete') && (
                <IconButton
                  onClick={() => void setIdToDelete(item._id)}
                  disabled={residences.some((residence) => (residence.accommodation as IAccommodation)._id === item._id && !residence.checkOutDate)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </ListTableCell>
          </ListTableRow>
        ))}
        {!sortedAccommodations.length && isFetching && (
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
          deleteAccommodation.mutateAsync(idToDelete as string).then(() => {
            const prevAccommodations = queryClient.getQueryData(['stock', JSON.stringify({})]) as IAccommodation[];
            queryClient.setQueryData(['stock', JSON.stringify({})], prevAccommodations.filter((item) => item._id !== idToDelete));
            setIdToDelete(null);
          });
        }}
      />
    </TableWrapper>
  );
};

export default memo(Table);
