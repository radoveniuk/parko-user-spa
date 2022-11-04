import { IUser } from 'interfaces/users.interface';

export const IMPORTABLE_USER_FIELDS: (keyof IUser)[] = ['email', 'name', 'surname', 'phone',
  'IBAN', 'ICO', 'adress', 'birthDate', 'city', 'country', 'hasPermit', 'pantsSize',
  'passNumber', 'tshortSize', 'zip',
  'permitExpire', 'permitType', 'rodneCislo', 'role', 'status',
];
