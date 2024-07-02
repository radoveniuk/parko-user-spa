import { DateTime } from 'luxon';

export const getDayoffStatus = (dateStart: string, dateEnd: string) => {
  const msStart = DateTime.fromISO(dateStart).startOf('day').toMillis();
  const msEnd = DateTime.fromISO(dateEnd).endOf('day').toMillis();
  const msNow = DateTime.now().toMillis();
  if (msNow > msStart && msNow < msEnd) {
    return 'continues';
  }
  if (dateEnd && msNow > msEnd) {
    return 'finished';
  }
  if (msNow < msStart) {
    return 'future';
  }
  return 'continues';
};
