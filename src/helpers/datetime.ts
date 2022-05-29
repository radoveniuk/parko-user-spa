import { DateTime } from 'luxon';

export const getDateFromIso = (value: string, format = 'dd.MM.yyyy') => DateTime.fromISO(value).toFormat(format);
