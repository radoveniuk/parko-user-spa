import { DateTime } from 'luxon';

export const getDateFromIso = (value?: unknown, format = 'dd.MM.yyyy') => typeof value === 'string' && value
  ? DateTime.fromISO(value).toFormat(format)
  : '';
