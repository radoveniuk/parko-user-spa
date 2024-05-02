import { MongoHistory } from './base.types';
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
}

export type UserPersonalDocType = 'idcard' | 'pass' | 'permit' | 'visa';

export type UserBusinessActivity = {
  description: string;
  dateFrom: string;
  dateTo?: string;
};

export interface IUser {
  _id: string;
  // base fields
  nickname: string;
  fullname?: string;
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
  recruiter: string | { name: string; surname: string; _id: string } | null;
  employmentRecruiter: string | { fullname: string; _id: string } | null;
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
  bankName: string;
  SWIFT: string;
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
  status: string;
  // customization
  customFields: Record<string, any>;
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
  // docs info
  docs?: (Record<string, string | boolean> & { type: UserPersonalDocType })[];

  projectStages: {
    [key: string]: {
      date: string;
      comment: string;
      active: boolean;
    };
  } | null;

  // NEW
  medicalInsurance: string;
  birthPlace: string;
  familyStatus: string;
  birthSurname: string;
  childrenCount: number;
  history?: MongoHistory<IUser>[];
  createdBy: string | null;
  updatedBy: string | null;
  businessName?: string;
  businessStatus?: 'active' | 'stopped' | 'closed';
  businessActivities?: UserBusinessActivity[];
  isDeleted?: boolean;
  workTypes: UserWorkType[];
  corporateBodyAddress?: string;
  tags?: string[];
  roles?: any[];
  createdAt?: string,
  updatedAt?: string,
}

export type UserWorkType = 'business' | 'employment';
