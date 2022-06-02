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
  internationalPassScan: string;
  passScan: string;
  idCardFaceScan: string;
  idCardBackScan: string;
  permitFaceScan: string;
  permitBackScan: string;
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
  project: string | IProject;
  status: string;
  role: UserRole;
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
