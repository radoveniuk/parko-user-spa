import { Path } from 'interfaces/base.types';
import { IEmployment } from 'interfaces/employment.interface';
import { IUser } from 'interfaces/users.interface';

export const EXPORT_USER_FIELDS: (Path<IUser>)[] = [
  'email', 'name', 'surname', 'phone', 'birthDate', 'sex',
  'country', 'adress',
  'passNumber', 'IBAN', 'ICO', 'DIC', 'rodneCislo',
  'permitNumber', 'permitDepartment', 'permitAdress',
  'roles', 'status', 'notes', 'position',
  'recruiter', 'source', 'bankName', 'SWIFT',
  'medicalInsurance', 'birthPlace', 'familyStatus',
  'birthSurname', 'childrenCount', 'businessName', 'businessStatus',
  'project', 'salary', 'salaryType',
];

export const EXPORT_USER_DOC_FIELDS = [
  'pass.number', 'pass.country', 'pass.dateFrom', 'pass.dateTo', 'pass.issuedBy',
  'visa.number', 'visa.dateFrom', 'visa.dateTo', 'visa.comment',
  'permit.number', 'permit.goal', 'permit.isMedicalCheck', 'permit.address', 'permit.dateFrom', 'permit.dateTo',
  'longtermstay.number', 'longtermstay.address', 'longtermstay.dateFrom', 'longtermstay.dateTo',
  'idcard.number', 'idcard.country', 'idcard.dateFrom', 'idcard.dateTo',
];

export const EXPORT_USER_EMPLOYMENT_FIELDS: (keyof IEmployment)[] = [
  'client', 'project', 'comment', 'hireDate', 'fireDate', 'fireReason', 'isChildTaxBonus', 'isNonTaxablePart', 'positionId', 'status',
];

export const IMPORT_USER_FIELDS: (keyof IUser)[] = [
  'email', 'name', 'surname', 'phone', 'IBAN', 'ICO', 'adress', 'birthDate',
  'city', 'country', 'hasPermit', 'pantsSize', 'passNumber', 'tshortSize', 'zip',
  'permitExpire', 'permitType', 'rodneCislo', 'status', 'sex', 'DIC', 'blocked', 'notes',
  'source', 'permitStartDate', 'permitAdress', 'hasMedicalExamination', 'permitDepartment',
  'permitNumber', 'position', 'cooperationStartDate', 'cooperationEndDate',
];

export const TRANSLATED_FIELDS: (keyof IUser)[] = [
  'status', 'sex',
];

export const DYNAMIC_FIELDS: (keyof IUser)[] = [
  'project', 'source', 'recruiter',
];
