import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import Skeleton from 'v2/uikit/Skeleton';

import { ArrowUpIcon, DeleteIcon, EditIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { iterateMap } from 'helpers/iterateMap';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import { IProjectAccommodation } from 'interfaces/projectAccommodation.interface';

import ProjectAccommodationDialog from '../../dialogs/ProjectAccommodationDialog';
import useProjectAccommodationActions from '../hooks/useProjectAccommodationActions';

import { TableWrapper } from './styles';
import { getCurrencyString } from 'v2/helpers/currency';

type Props = {
  activeCols: string[];
  data: IProjectAccommodation<true>[];
  isFetching?: boolean;
};

const Table = ({
  activeCols,
  data,
  isFetching,
}: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const { sortedData, sorting, sortingToggler } = useSortedList(data);

  const toggleSorting = (residenceKey: string) => {
    sortingToggler(residenceKey, `metadata.${residenceKey}` as SortingValue<IProjectAccommodation<true>>);
  };

  // update row
  const [rowToUpdate, setRowToUpdate] = useState<null | IProjectAccommodation<true>>(null);

  // delete row
  const { remove } = useProjectAccommodationActions();
  const [rowToDelete, setRowToDelete] = useState<null | string>(null);

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
                onClick={() => void toggleSorting(col.replace('accommodation.', '') as keyof IProjectAccommodation)}
              >
                {t(col)}
                <IconButton
                  className={
                    sorting?.key === (col.replace('accommodation.', '') as keyof IProjectAccommodation)
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
        {sortedData.map((item: IProjectAccommodation<true>) => (
          <ListTableRow key={item._id}>
            <ListTableCell>
              {item.project.name}
            </ListTableCell>
            <ListTableCell>
              {item.client.shortName}
            </ListTableCell>
            <ListTableCell>{item.accommodation.name}</ListTableCell>
            <ListTableCell>{item.accommodation.adress}</ListTableCell>
            <ListTableCell>{item.payer.shortName}</ListTableCell>
            <ListTableCell>{t(`selects.projectAccommodationTariff.${item.damageCompencationTariff}`)}</ListTableCell>
            <ListTableCell>{getCurrencyString(item.damageCompencationPrice)}</ListTableCell>
            <ListTableCell>{t(`selects.projectAccommodationTariff.${item.reinvoicingTariff}`)}</ListTableCell>
            <ListTableCell>{getCurrencyString(item.reinvoicingPrice)}</ListTableCell>
            <ListTableCell align="right">
              {permissions.includes('accommodations:update') && (
                <IconButton onClick={() => void setRowToUpdate(item)}><EditIcon /></IconButton>
              )}
              {permissions.includes('accommodations:delete') && (
                <IconButton onClick={() => setRowToDelete(item._id)}><DeleteIcon /></IconButton>
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
        open={!!rowToDelete}
        onClose={() => void setRowToDelete(null)}
        onSubmit={() => {
          remove(rowToDelete as string);
          setRowToDelete(null);
        }}
      />
      {!!rowToUpdate && (
        <ProjectAccommodationDialog
          open={!!rowToUpdate}
          onClose={() => void setRowToUpdate(null)}
          data={rowToUpdate}
        />
      )}
    </TableWrapper>
  );
};

export default memo(Table);
