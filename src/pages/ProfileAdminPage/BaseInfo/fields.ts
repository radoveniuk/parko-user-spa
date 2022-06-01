import { IUser } from 'interfaces/users.interface';
import { DateTime } from 'luxon';

type UserField = keyof IUser | {
  key: keyof IUser,
  get(v: any): string
};

const dateFromIso = (v: string) => v ? DateTime.fromISO(v).toFormat('dd.MM.yyyy') : '';
const selectGetter = (v: string) => v ? `selects.${v}` : v;

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
  { key: 'permitType', get: selectGetter },
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
  { key: 'study', get: selectGetter },
  'speciality',
  { key: 'familyState', get: selectGetter },
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