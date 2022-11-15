import { IUser } from 'interfaces/users.interface';

export const EXPORT_USER_FIELDS: (keyof IUser)[] = [
  'email', 'name', 'surname', 'phone', 'project',
  'IBAN', 'ICO', 'adress', 'birthDate', 'city', 'country', 'hasPermit', 'pantsSize',
  'passNumber', 'tshortSize', 'zip',
  'permitExpire', 'permitType', 'rodneCislo', 'role', 'status', 'sex', 'DIC', 'blocked', 'notes',
  'recruiter', 'source', 'permitStartDate', 'permitAdress', 'hasMedicalExamination', 'permitDepartment',
  'permitNumber', 'position', 'cooperationStartDate', 'cooperationEndDate',
];

export const IMPORT_USER_FIELDS: (keyof IUser)[] = [
  'email', 'name', 'surname', 'phone', 'IBAN', 'ICO', 'adress', 'birthDate',
  'city', 'country', 'hasPermit', 'pantsSize', 'passNumber', 'tshortSize', 'zip',
  'permitExpire', 'permitType', 'rodneCislo', 'role', 'status', 'sex', 'DIC', 'blocked', 'notes',
  'source', 'permitStartDate', 'permitAdress', 'hasMedicalExamination', 'permitDepartment',
  'permitNumber', 'position', 'cooperationStartDate', 'cooperationEndDate',
];

export const TRANSLATED_FIELDS: (keyof IUser)[] = [
  'role', 'status', 'sex',
];

export const DYNAMIC_FIELDS: (keyof IUser)[] = [
  'project', 'source', 'recruiter',
];
