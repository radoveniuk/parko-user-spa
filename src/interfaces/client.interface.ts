export interface IClient {
  _id: string;
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
  createdAt?: string,
  updatedAt?: string,
}
