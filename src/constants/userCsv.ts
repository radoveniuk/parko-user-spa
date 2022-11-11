import { IUser } from 'interfaces/users.interface';

export const IMPORTABLE_USER_FIELDS: (keyof IUser)[] = [
  'email', 'name', 'surname', 'phone', 'project',
  'IBAN', 'ICO', 'adress', 'birthDate', 'city', 'country', 'hasPermit', 'pantsSize',
  'passNumber', 'tshortSize', 'zip',
  'permitExpire', 'permitType', 'rodneCislo', 'role', 'status', 'sex', 'DIC', 'blocked', 'notes',
  'recruiter', 'source', 'permitStartDate', 'permitAdress', 'hasMedicalExamination', 'permitDepartment',
  'permitNumber', 'position', 'cooperationStartDate', 'cooperationEndDate',
];

export const TRANSLATED_FIELDS: (keyof IUser)[] = [
  'hasPermit', 'role', 'status', 'sex', 'blocked',
  'hasMedicalExamination', 'permitType',
];

export const DYNAMIC_FIELDS: (keyof IUser)[] = [
  'project', 'source', 'recruiter',
];
