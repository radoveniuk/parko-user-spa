import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { useDeleteAccommodation } from 'api/mutations/accommodationMutation';
import { useGetAccommodations } from 'api/query/accommodationQuery';
import { ArrowUpIcon, CloseIcon, EditIcon } from 'components/icons';
import DialogConfirm from 'components/shared/DialogConfirm';
import { FiltersBar } from 'components/shared/Filters';
import IconButton from 'components/shared/IconButton';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import usePrev from 'hooks/usePrev';
import useSortedList from 'hooks/useSortedList';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IResidence } from 'interfaces/residence.interface';

import { useActiveAccommodation } from '../contexts/AccommodationContext';

const COLUMNS = [
  'accommodation.owner',
  'accommodation.adress',
  'accommodation.costNight',
  'accommodation.costMonth',
  'accommodation.tariff',
  'accommodation.managerPhone',
  'accommodation.receptionPhone',
  'comment',
  '',
  '',
];

const Accommodations = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: accommodations = [], refetch } = useGetAccommodations();
  const { sortedData: sortedAccommodations, sorting, sortingToggler } = useSortedList(accommodations);
  const deleteAccommodation = useDeleteAccommodation();

  const [openAccommodation, setOpenAccommodation] = useActiveAccommodation();

  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const residences: IResidence[] = queryClient.getQueryData(['residences', JSON.stringify({})]) || [];

  const prevAccommodation = usePrev(openAccommodation);
  useEffect(() => {
    if (!!prevAccommodation && !openAccommodation) {
      refetch();
    }
  }, [openAccommodation, prevAccommodation, refetch]);

  return (
    <>
      <FiltersBar></FiltersBar>
      <ListTable
        maxHeight="calc(100vh - 100px)"
        columns={COLUMNS}
        columnComponent={(col) => col && (
          <div role="button" className="col-item" onClick={() => {
            const sortingKey = col.replace('accommodation.', '') as keyof IAccommodation;
            sortingToggler(sortingKey, sortingKey);
          }}>
            {t(col)}
            <IconButton
              className={sorting?.key === col.replace('accommodation.', '') as keyof IAccommodation ? `sort-btn active ${sorting.dir}` : 'sort-btn'}
            >
              <ArrowUpIcon />
            </IconButton>
          </div>
        )}
      >
        {sortedAccommodations.map((item) => (
          <ListTableRow key={item._id}>
            <ListTableCell>{item.owner}</ListTableCell>
            <ListTableCell>{item.adress}</ListTableCell>
            <ListTableCell>{item.costNight}</ListTableCell>
            <ListTableCell>{item.costMonth}</ListTableCell>
            <ListTableCell>{item.tariff && t(`selects.accommodationTariff.${item.tariff}`)}</ListTableCell>
            <ListTableCell>{item.managerPhone}</ListTableCell>
            <ListTableCell>{item.receptionPhone}</ListTableCell>
            <ListTableCell>{item.comment}</ListTableCell>
            <ListTableCell><IconButton onClick={() => void setOpenAccommodation(item)}><EditIcon /></IconButton></ListTableCell>
            <ListTableCell>
              <IconButton
                onClick={() => void setIdToDelete(item._id)}
                disabled={residences.some((residence) => (residence.accommodation as IAccommodation)._id === item._id && !residence.checkOutDate)}
              >
                <CloseIcon />
              </IconButton>
            </ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
      <DialogConfirm
        onClose={() => void setIdToDelete(null)}
        open={!!idToDelete}
        onSubmit={() => {
          deleteAccommodation.mutateAsync(idToDelete as string).then(() => {
            setIdToDelete(null);
            refetch();
          });
        }}
      />
    </>
  );
};

export default Accommodations;
