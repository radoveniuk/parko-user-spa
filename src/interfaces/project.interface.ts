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
  matterId: string;
};

export interface IProject {
  _id: string;
  client: string | Partial<IClient> | null;
  stages?: string[];
  name: string;
  positions?: ProjectPosition[];
  type?: string;
  zamestnavatel?: string;
  uzivatelskyZamestnavatel?: string;
  businessName?: string;

  createdAt: string;
  updatedAt: string;
}
