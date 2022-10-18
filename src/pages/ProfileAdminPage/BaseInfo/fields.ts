import { DateTime } from 'luxon';

import { IUser } from 'interfaces/users.interface';

type UserField = keyof IUser | {
  key: keyof IUser,
  get(v: any): string
};

const dateFromIso = (v: string) => v ? DateTime.fromISO(v).toFormat('dd.MM.yyyy') : '';
const selectGetter = (select: string, v: string) => v ? `selects.${select}.${v}` : v;

export const USER_FIELDS: UserField[] = [
  'email',
  'phone',
  { key: 'birthDate', get: dateFromIso },
  'internationalPassNumber',
  { key: 'internationalPassExpire', get: dateFromIso },
  'internationalPassAuthority',
  'hasIdCard',
  'passNumber',
  'hasPermit',
  { key: 'permitType', get: (v) => selectGetter('permitType', v) },
  { key: 'permitExpire', get: dateFromIso },
  'hasPrevPermit',
  'rodneCislo',
  'IBAN',
  'ICO',
  'birthPlace',
  'country',
  'adress',
  'city',
  'zip',
  'tshortSize',
  'pantsSize',
  'shoesSize',
  { key: 'study', get: (v) => selectGetter('study', v) },
  'speciality',
  { key: 'familyState', get: (v) => selectGetter('familyStatus', v) },
  'prevSurname',
  'hasChildren',
  'hasSiblings',
  'motherName',
  'motherSurname',
  'motherPrevSurname',
  { key: 'motherBirthdate', get: dateFromIso },
  'fatherName',
  'fatherSurname',
  { key: 'fatherBirthdate', get: dateFromIso },
];
