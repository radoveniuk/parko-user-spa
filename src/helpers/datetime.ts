import { DateTime } from 'luxon';

export const getDateFromIso = (value?: string | null, format = 'dd.MM.yyyy') => value ? DateTime.fromISO(value).toFormat(format) : '';
