import { IMongoDoc } from './base.types';

export interface IClient extends IMongoDoc {
  name: string;
  shortName: string;
  comment: string;
  ICO: string;
  DIC: string;
  ICDPH: string;
  sidlo: string;
  websiteUrl: string;
  contactPerson: string;
  contactPersonPosition: string;
  email: string;
  phone: string;
  cooperationStartDate: string;
  cooperationEndDate?: string;
  status: string;
  managers?: string[] | { name: string; surname: string; _id: string }[] | null;
  isInternal?: boolean;
}
