import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import Skeleton from 'v2/uikit/Skeleton';

import { useDeleteResidence } from 'api/mutations/residenceMutation';
import { ArrowUpIcon, DeleteIcon, EditIcon } from 'components/icons';
import { useFilters } from 'components/shared/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { iterateMap } from 'helpers/iterateMap';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import { useActiveAccommodation } from '../../contexts/AccommodationContext';
import { useActiveResidence } from '../../contexts/ResidenceContext';

import { TableWrapper } from './styles';

type ResidenceTableRow = {
  _id: string;
  user: string;
  project: string;
  owner: string;
  adress: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  days: number;
  costNight: string;
  sum: number;
  metadata: IResidence;
};

type Props = {
  activeCols: string[];
  data: ResidenceTableRow[];
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

  const toggleSorting = (residenceKey: string) => {
    sortingToggler(residenceKey, `metadata.${residenceKey}` as SortingValue<ResidenceTableRow>);
  };

  const [, setOpenAccommodation] = useActiveAccommodation();
  const [, setOpenResidence] = useActiveResidence();
  const deleteResidence = useDeleteResidence();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  return (
    <TableWrapper>
      <ListTable
        columns={activeCols}
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
        {sortedData.map((item: ResidenceTableRow) => {
          const user = item.metadata.user as IUser;
          const project = user.project as IProject;
          const client = project?.client as IClient;
          return (
            <ListTableRow key={item._id}>
              <ListTableCell>
                <Link to={`/profile/${(item.metadata.user as IUser)._id}`} className="table-link">{item.user}</Link>
              </ListTableCell>
              <ListTableCell>
                {client ? `${client.shortName} > ` : ''}{project?.name}
              </ListTableCell>
              <ListTableCell>{item.owner}</ListTableCell>
              <ListTableCell>
                <div
                  role="button"
                  className="table-link"
                  onClick={() => void setOpenAccommodation(item.metadata.accommodation as IAccommodation)}
                >
                  {item.adress}
                </div>
              </ListTableCell>
              <ListTableCell>{item.checkInDate}</ListTableCell>
              <ListTableCell>{item.checkOutDate}</ListTableCell>
              <ListTableCell>{item.days}</ListTableCell>
              <ListTableCell>{item.costNight}</ListTableCell>
              <ListTableCell>{item.sum}</ListTableCell>
              <ListTableCell>
                {permissions.includes('residences:update') && (
                  <IconButton onClick={() => void setOpenResidence(item.metadata)}><EditIcon /></IconButton>
                )}
                {permissions.includes('residences:delete') && (
                  <IconButton onClick={() => void setIdToDelete(item._id)}><DeleteIcon /></IconButton>
                )}
              </ListTableCell>
            </ListTableRow>
          );
        })}
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
