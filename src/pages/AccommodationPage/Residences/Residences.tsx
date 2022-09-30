import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import { useDeleteResidence } from 'api/mutations/residenceMutation';
import { useGetResidences } from 'api/query/residenceQuery';
import { CloseIcon, EditIcon } from 'components/icons';
import DialogConfirm from 'components/shared/DialogConfirm';
import { FiltersBar, FiltersProvider, useFilters } from 'components/shared/Filters';
import { FilterDate } from 'components/shared/Filters/Filters';
import IconButton from 'components/shared/IconButton';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import useDebounce from 'hooks/useDebounce';
import usePrev from 'hooks/usePrev';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

import { useActiveResidence } from '../contexts/ResidenceContext';

const COLUMNS = [
  'user.name',
  'accommodation.owner',
  'accommodation.adress',
  'accommodation.checkIn',
  'accommodation.checkOut',
  'accommodation.days',
  'accommodation.costNight',
  'accommodation.sum',
  '',
  '',
];

type ResidenceTableRow = {
  _id: string;
  user: string;
  owner: string;
  adress: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  days: number;
  costNight: string;
  sum: number;
  metadata: IResidence;
};

const getDays = (residence: IResidence) => {
  if (!residence.checkInDate) return null;

  const checkIn = DateTime.fromISO(residence.checkInDate);

  if (residence.checkOutDate) {
    const checkOut = DateTime.fromISO(residence.checkOutDate);
    const diff = -checkIn.diff(checkOut, 'days').days.toFixed();
    return diff > 0 ? diff : 0;
  }

  const diff = -checkIn.diffNow('days').days.toFixed();
  return diff > 0 ? diff : 0;
};

const Residences = () => {
  const { t } = useTranslation();
  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);
  const { data: residences = [], refetch } = useGetResidences(filtersState);
  const tableData: ResidenceTableRow[] = useMemo(() => residences.map((item) => {
    const { name, surname } = item.user as IUser;
    const { owner, adress, costNight } = item.accommodation as IAccommodation;
    const days = getDays(item) || 0;
    return {
      _id: item._id,
      user: `${name} ${surname}`,
      owner,
      adress,
      checkInDate: getDateFromIso(item.checkInDate),
      checkOutDate: getDateFromIso(item.checkOutDate),
      days,
      costNight,
      sum: days * Number(costNight),
      metadata: item,
    };
  }), [residences]);

  const [openResidence, setOpenResidence] = useActiveResidence();

  const deleteResidence = useDeleteResidence();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const prevResidence = usePrev(openResidence);
  useEffect(() => {
    if (!!prevResidence && !openResidence) {
      refetch();
    }
  }, [openResidence, prevResidence, refetch]);

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <>
      <FiltersBar>
        <FilterDate label={t('firstDate')} filterKey="firstDate" />
        <FilterDate label={t('lastDate')} filterKey="lastDate" />
      </FiltersBar>
      <ListTable columns={COLUMNS} >
        {tableData.map((item) => (
          <ListTableRow key={item._id}>
            <ListTableCell>
              <Link to={`/profile/${(item.metadata.user as IUser)._id}`} style={{ color: themeConfig.palette.primary.light }}>{item.user}</Link>
            </ListTableCell>
            <ListTableCell>{item.owner}</ListTableCell>
            <ListTableCell>{item.adress}</ListTableCell>
            <ListTableCell>{item.checkInDate}</ListTableCell>
            <ListTableCell>{item.checkOutDate}</ListTableCell>
            <ListTableCell>{item.days}</ListTableCell>
            <ListTableCell>{item.costNight}</ListTableCell>
            <ListTableCell>{item.sum}</ListTableCell>
            <ListTableCell><IconButton onClick={() => void setOpenResidence(item.metadata)}><EditIcon /></IconButton></ListTableCell>
            <ListTableCell><IconButton onClick={() => void setIdToDelete(item._id)}><CloseIcon /></IconButton></ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
      <DialogConfirm
        onClose={() => void setIdToDelete(null)}
        open={!!idToDelete}
        onSubmit={() => {
          deleteResidence.mutateAsync(idToDelete as string).then(() => {
            setIdToDelete(null);
            refetch();
          });
        }}
      />
    </>
  );
};

export default function ResidencesWithFilters () {
  return (
    <FiltersProvider>
      <Residences />
    </FiltersProvider>
  );
};
