import { IMongoDoc } from './base.types';
import { IClient } from './client.interface';
import { ICustomForm } from './form.interface';
import { IProject } from './project.interface';
import { IUser } from './users.interface';

export interface IOrder<T extends boolean = false> extends IMongoDoc {
  name: string;
  status: string;
  client: T extends true ? IClient : string;
  project: T extends true ? IProject : string;
  positionName: string;
  cooperationType: string;
  salary: string;
  location: string;
  variability: string;
  managers: (T extends true ? IUser : string)[];
  specificationUrl: string;
  form: T extends true ? ICustomForm : string;
  stages: IOrderStage[];
  goal: number;
  comment: string;
  dateFrom: string;
  dateTo: string;
  createdBy: T extends true ? IUser : string;
  updatedBy: string | null;
}

export interface IOrderStage {
  name: string;
  color: string;
  isRequired: boolean;
}
