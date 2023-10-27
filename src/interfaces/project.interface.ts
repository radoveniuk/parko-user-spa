import { AnyObject } from './base.types';
import { IClient } from './client.interface';

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

  createdAt: Date;
}
