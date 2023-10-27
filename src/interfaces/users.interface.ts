import { IFile } from './file.interface';
import { IProject } from './project.interface';

export type LoginDto = {
  nickname: string;
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

export type UserRole = 'user' | 'admin' | 'recruiter' | 'super-admin';

export interface IUser {
  _id: string;
  // base fields
  nickname: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
  phone: string;
  birthDate: string;
  passNumber: string;
  sex: 'male' | 'female';
  blocked: boolean;
  notes: string;
  // system data
  recruiter: string | { name: string; surname: string; } | null;
  source: string;
  project: string | IProject | null;
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
  cooperationType: string;
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
  // docscans
  internationalPassScan: string | IFile;
  passScan: string | IFile;
  idCardFaceScan: string | IFile;
  idCardBackScan: string | IFile;
  permitFaceScan: string | IFile;
  permitBackScan: string | IFile;

  projectStages: {
    [key: string]: {
      date: string;
      comment: string;
      active: boolean;
    };
  } | null;

  tags?: string[];
  createdAt?: string,
  updatedAt?: string,
}
