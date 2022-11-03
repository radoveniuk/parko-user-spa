import { IFile } from './file.interface';
import { IProject } from './project.interface';

export interface IUser {
  _id: string;
  // base fields
  email: string;
  name: string;
  surname: string;
  password?: string;
  phone: string;
  birthDate: string;
  // docs
  hasInternationalPass: boolean;
  internationalPassNumber: string;
  internationalPassExpire: string;
  internationalPassAuthority: string;
  hasIdCard: boolean;
  passNumber: string;
  // slovak docs
  hasPermit: boolean;
  permitType: string;
  permitExpire: string;
  hasPrevPermit: boolean;
  rodneCislo: string;
  IBAN: string;
  ICO: string;
  // adress
  birthPlace: string;
  country: string;
  adress: string;
  city: string;
  zip: string;
  // biometry
  tshortSize: string;
  pantsSize: string;
  shoesSize: string;
  // docscans
  internationalPassScan: string | IFile;
  passScan: string | IFile;
  idCardFaceScan: string | IFile;
  idCardBackScan: string | IFile;
  permitFaceScan: string | IFile;
  permitBackScan: string | IFile;
  // expirience
  study: string;
  speciality: string;
  // family info
  familyState: string;
  prevSurname: string;
  hasChildren: boolean;
  childrenJson: string;
  hasSiblings: boolean;
  siblingsJson: string;
  motherName: string;
  motherSurname: string;
  motherPrevSurname: string;
  motherBirthdate: string;
  fatherName: string;
  fatherSurname: string;
  fatherBirthdate: string;
  project: string | IProject | null;
  status: string;
  role: UserRole;
  employmentType: string;
  salary: string;
  salaryType: string;
  salaryComment: string;

  customFields: Record<string, unknown>;

  otherScans?: string[] | IFile[];
}

export type LoginDto = {
  email: string;
  password: string;
}

export type RegisterUserDto = {
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
}

export type UserRole = 'user' | 'admin'

export interface IUser2 {
  _id: string;
  // base fields
  name: string;
  surname: string;
  email: string;
  password?: string;
  phone: string;
  birthDate: string;
  passNumber: string;
  sex: string;
  blocked: boolean;
  notes: string;
  // system data
  recruiter: string;
  source: string;
  project: string;
  // adress
  country: string;
  adress: string;
  city: string;
  zip: string;
  // permit docs
  hasPermit: boolean;
  rodneCislo: string;
  permitStartDate: string;
  permitExpire: string;
  permitType: string;
  hasMedicalExamination: boolean;
  // business docs
  IBAN: string;
  ICO: string;
  DIC: string;
  permitAdress: string;
  permitDepartment: string;
  permitNumber: string;
  // biometry
  tshortSize: string;
  pantsSize: string;
  shoesSize: string;
  // work data
  employmentType: string;
  position: string;
  cooperationStartDate: string;
  cooperationEndDate: string;
  // settings
  role: UserRole;
  status: string;
  // customization
  customFields: Record<string, unknown>;
  otherScans: any[];
  // salary
  salary: string;
  salaryType: string;
  salaryComment: string;
}
