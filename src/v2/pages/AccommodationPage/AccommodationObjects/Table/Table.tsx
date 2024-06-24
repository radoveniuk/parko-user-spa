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
import { iterateMap } from 'helpers/iterateMap';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IResidence } from 'interfaces/residence.interface';

import { useActiveAccommodation } from '../../contexts/AccommodationContext';

import { TableWrapper } from './styles';

type Props = {
  activeCols: string[];
  data: IAccommodation[];
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

  const toggleSorting = (accommodationKey: string) => {
    let sortingPath = accommodationKey as SortingValue<IAccommodation>;
    if (accommodationKey === 'costNight' || accommodationKey === 'costMonth') {
      sortingPath = (row) => Number(row[accommodationKey]);
    }
    if (accommodationKey === 'name') {
      sortingPath = (row) => row.name || row.owner;
    }
    sortingToggler(accommodationKey, sortingPath);
  };

  const [, setOpenAccommodation] = useActiveAccommodation();
  const deleteAccommodation = useDeleteAccommodation();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const residences: IResidence[] = queryClient.getQueryData(['residences', JSON.stringify({})]) || [];

  const { permissions } = useAuthData();

  return (
    <TableWrapper>
      <ListTable
        columns={activeCols}
        className="accommodations-table"
        columnComponent={(col) => {
          if (col) {
            return (
              <div
                role="button"
                className="col-item"
                onClick={() => void toggleSorting(col.replace('accommodation.', '') as keyof IAccommodation)}
              >
                {t(col)}
                <IconButton
                  className={
                    sorting?.key === (col.replace('accommodation.', '') as keyof IAccommodation)
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
            <ListTableCell>{item.name || item.owner}</ListTableCell>
            <ListTableCell>{item.adress}</ListTableCell>
            <ListTableCell>{Number(item.costNight).toFixed(2).replace('.', ',')}</ListTableCell>
            <ListTableCell>{Number(item.costMonth).toFixed(2).replace('.', ',')}</ListTableCell>
            <ListTableCell>{item.tariff && t(`selects.accommodationTariff.${item.tariff}`)}</ListTableCell>
            <ListTableCell>{item.managerPhone}</ListTableCell>
            <ListTableCell>{item.receptionPhone}</ListTableCell>
            <ListTableCell>{item.comment}</ListTableCell>
            <ListTableCell>
              {permissions.includes('accommodations:update') && (
                <IconButton onClick={() => void setOpenAccommodation(item)}><EditIcon /></IconButton>
              )}
              {permissions.includes('accommodations:delete') && (
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
            const prevAccommodations = queryClient.getQueryData(['accommodations', JSON.stringify({})]) as IAccommodation[];
            queryClient.setQueryData(['accommodations', JSON.stringify({})], prevAccommodations.filter((item) => item._id !== idToDelete));
            setIdToDelete(null);
          });
        }}
      />
    </TableWrapper>
  );
};

export default memo(Table);
