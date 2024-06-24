import { useCallback } from 'react';
import { DateTime } from 'luxon';
import { useFilters } from 'v2/components/Filters';

import { IResidence } from 'interfaces/residence.interface';

const useResidenceDaysDiff = () => {
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
  return getDaysDiff;
};

export default useResidenceDaysDiff;
