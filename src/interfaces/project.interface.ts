import { AnyObject } from './base.types';
import { IClient } from './client.interface';

export type ProjectPosition = {
  internalName: string;
  ISCO: string;
  name: string;
  address: string;
  employmentType: string;
  variability: number;
  salary: number;
  salaryType: string;
  workFundH: number;
  workFundD: number;
  workFundHW: number;
  docs: string[];
  id: string;
};

export interface IProject {
  _id: string;
  email: string;
  phone: string;
  name: string;
  comment: string;
  dateStart: string | null;
  dateEnd: string | null;
  cost: string;
  tariff: string;
  status: string;
  location: string;
  stages?: string[];
  client: string | Partial<IClient> | null;
  customFields: AnyObject;
  positions?: ProjectPosition[];
  type?: string;
  zamestnavatel?: string;
  uzivatelskyZamestnavatel?: string;
  businessName?: string;

  createdAt: string;
  updatedAt: string;
}
