import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { useFilters } from 'v2/components/Filters';

import { getDateFromIso } from 'helpers/datetime';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IResidence } from 'interfaces/residence.interface';

export type TableColumnKey ='adress'
|'name'
|'costNight'
|'costMonth'
|'checkIn'
|'checkOut'
|'days'
|'sum'
|'client'
|'userStatus'
|'userCooperationStartDate'
|'userCooperationEndDate'
|'userCooperationType'
|'project'
|'createdBy'
|'updatedBy'
|'createdAt'
|'updatedAt'

const useGetTableCellContent = () => {
  const { t } = useTranslation();
  const { filtersState } = useFilters();
  const getDaysDiff = useCallback((residence: IResidence) => {
    if (!residence.checkInDate) return null;

    let checkIn = DateTime.fromISO(residence.checkInDate);

    if (
      filtersState?.firstDate &&
      DateTime.fromISO(filtersState?.firstDate).toMillis() > DateTime.fromISO(residence.checkInDate).toMillis()
    ) {
      checkIn = DateTime.fromISO(filtersState?.firstDate);
    }

    if (filtersState?.lastDate) {
      const filterLastDateMs = DateTime.fromISO(filtersState?.lastDate).toMillis();
      const checkOutDateMs = residence.checkOutDate ? DateTime.fromISO(residence.checkOutDate).toMillis() : null;
      if (checkOutDateMs && checkOutDateMs < filterLastDateMs) {
        const checkOut = DateTime.fromISO(residence.checkOutDate as string);
        const diff = -checkIn.diff(checkOut, 'days').days.toFixed();
        return diff > 0 ? diff : 0;
      }
      const checkOut = DateTime.fromISO(filtersState.lastDate);
      const diff = -checkIn.diff(checkOut, 'days').days.toFixed();
      return diff > 0 ? diff : 0;
    }

    if (residence.checkOutDate) {
      const checkOut = DateTime.fromISO(residence.checkOutDate as string);
      const diff = -checkIn.diff(checkOut, 'days').days.toFixed();
      return diff > 0 ? diff : 0;
    }

    const diff = -checkIn.diffNow('days').days.toFixed();
    return diff > 0 ? diff + 1 : 0;
  }, [filtersState?.firstDate, filtersState?.lastDate]);

  const generateCellContent = useCallback((row: IResidence, key: TableColumnKey) => {
    if (key === 'adress') {
      const accommodation = (row.accommodation as IAccommodation);
      return accommodation[key];
    }
    if (key === 'name') {
      const accommodation = (row.accommodation as IAccommodation);
      return accommodation.name || accommodation.owner;
    }
    if (key === 'costNight' || key === 'costMonth') {
      const accommodation = (row.accommodation as IAccommodation);
      return Number(accommodation[key]).toFixed(2).replace('.', ',');
    }
    if (key === 'checkIn' || key === 'checkOut') {
      const residenceKey = `${key}Date` as keyof IResidence;
      return getDateFromIso(row[residenceKey]);
    }
    if (key === 'days') {
      return getDaysDiff(row);
    }
    if (key === 'sum') {
      const sum = (getDaysDiff(row) || 0) * Number((row.accommodation as IAccommodation).costNight);
      return sum.toFixed(2).replace('.', ',');
    }
    if (key === 'client') {
      return (row.client as IClient)?.shortName;
    }
    if (key === 'userStatus') {
      return t(`selects.userStatus.${row.userStatus}`);
    }
    if (key === 'userCooperationStartDate' || key === 'userCooperationEndDate') {
      return getDateFromIso(row[key]);
    }
    if (key === 'userCooperationType') {
      return row.userWorkTypes.map((wT) => t(`selects.userWorkType.${wT}`)).join(', ');
    }
    if (key === 'project') {
      return (row.project as IProject)?.name;
    }
    if (key === 'createdBy' || key === 'updatedBy') {
      return row[key]?.fullname;
    }
    if (key === 'createdAt' || key === 'updatedAt') {
      return getDateFromIso(row[key], 'dd.MM.yyyy HH:mm');
    }

    return row[key as keyof typeof row] as string;
  }, [getDaysDiff, t]);

  return generateCellContent;
};

export default useGetTableCellContent;
