import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

import { useGetResidences } from 'api/query/residenceQuery';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IResidence } from 'interfaces/residence.interface';

import { EmptyDataWrapper } from '../styles';

const COLUMNS = [
  'accommodation.owner',
  'accommodation.adress',
  'accommodation.checkIn',
  'accommodation.checkOut',
  'accommodation.days',
  'accommodation.costNight',
  'accommodation.sum',
];

type ResidenceTableRow = {
  _id: string;
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
  const { id: user } = useParams();

  const { data: residences = [] } = useGetResidences({ user });
  const tableData: ResidenceTableRow[] = useMemo(() => residences.map((item) => {
    const { owner, adress, costNight } = item.accommodation as IAccommodation;
    const days = getDays(item) || 0;
    return {
      _id: item._id,
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

  if (!residences.length) {
    return (
      <EmptyDataWrapper>
        {t('noData')}
      </EmptyDataWrapper>
    );
  };

  return (
    <ListTable columns={COLUMNS} maxHeight="calc(100vh - 300px)">
      {tableData.map((item) => (
        <ListTableRow key={item._id}>
          <ListTableCell>{item.owner}</ListTableCell>
          <ListTableCell>{item.adress}</ListTableCell>
          <ListTableCell>{item.checkInDate}</ListTableCell>
          <ListTableCell>{item.checkOutDate}</ListTableCell>
          <ListTableCell>{item.days}</ListTableCell>
          <ListTableCell>{item.costNight}</ListTableCell>
          <ListTableCell>{item.sum}</ListTableCell>
        </ListTableRow>
      ))}
    </ListTable>
  );
};

export default Residences;
