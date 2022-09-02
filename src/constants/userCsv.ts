import { IUser } from 'interfaces/users.interface';

export const IMPORTABLE_USER_FIELDS: (keyof IUser)[] = ['email', 'name', 'surname', 'phone',
  'IBAN', 'ICO', 'adress', 'birthDate', 'birthPlace', 'city', 'country',
  'familyState', 'fatherBirthdate', 'fatherName', 'fatherSurname', 'hasChildren',
  'hasIdCard', 'hasInternationalPass', 'hasPermit', 'hasPrevPermit', 'hasSiblings',
  'motherBirthdate', 'motherName', 'motherPrevSurname', 'motherSurname', 'pantsSize',
  'passNumber', 'prevSurname', 'shoesSize', 'speciality', 'study', 'tshortSize', 'zip',
  'internationalPassAuthority', 'internationalPassExpire', 'internationalPassNumber',
  'permitExpire', 'permitType', 'rodneCislo', 'role', 'status',
];
