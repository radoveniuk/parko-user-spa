import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useFilters } from 'v2/components/Filters';
import { useTableColumns } from 'v2/contexts/TableColumnsContext';
import { useTableSelectedItems } from 'v2/contexts/TableSelectedItemsContext';
import { Checkbox } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import Skeleton from 'v2/uikit/Skeleton';

import { useDeleteResidence } from 'api/mutations/residenceMutation';
import { ArrowUpIcon, DeleteIcon, EditIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { iterateMap } from 'helpers/iterateMap';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import { useActiveResidence } from '../../contexts/ResidenceContext';
import useGetTableCellContent, { TableColumnKey } from '../hooks/useGetTableCellContent';

import { TableWrapper } from './styles';

type Props = {
  data: IResidence[];
  isFetching?: boolean;
};

const Table = ({
  data,
  isFetching,
}: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();
  const queryClient = useQueryClient();
  const { filtersState } = useFilters();

  const { sortedData, sorting, sortingToggler } = useSortedList(data);

  const toggleSorting = (residenceKey: string) => {
    sortingToggler(residenceKey, `metadata.${residenceKey}` as SortingValue<IResidence>);
  };

  const [, setOpenResidence] = useActiveResidence();
  const deleteResidence = useDeleteResidence();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const [activeCols] = useTableColumns();

  const generateCellContent = useGetTableCellContent();

  // select items
  const [selectedItems, { toggle: toggleSelectedRow }] = useTableSelectedItems();

  const selectRowChangeHandler = useCallback((row: IResidence) => () => {
    toggleSelectedRow(row);
  }, [toggleSelectedRow]);

  return (
    <TableWrapper>
      <ListTable
        columns={['', ...activeCols, '']}
        className="residences-table"
        columnComponent={(col) => {
          if (col) {
            return (
              <div
                role="button"
                className="col-item"
                onClick={() => void toggleSorting(col.replace('accommodation.', '') as keyof IResidence)}
              >
                {t(col)}
                <IconButton
                  className={
                    sorting?.key === (col.replace('accommodation.', '') as keyof IUser)
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
        {sortedData.map((item: IResidence) => (
          <ListTableRow key={item._id}>
            <ListTableCell>
              <Checkbox
                checked={selectedItems.some((selectedItem: IResidence) => selectedItem._id === item._id)}
                onChange={selectRowChangeHandler(item)}
              />
            </ListTableCell>
            {activeCols.map((col) => (
              <ListTableCell key={col}>
                {generateCellContent(item, col.replace('accommodation.', '') as TableColumnKey)}
              </ListTableCell>
            ))}
            <ListTableCell align="right">
              {permissions.includes('residences:update') && (
                <IconButton onClick={() => void setOpenResidence(item)}><EditIcon /></IconButton>
              )}
              {permissions.includes('residences:delete') && (
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
    </TableWrapper>
  );
};

export default memo(Table);
