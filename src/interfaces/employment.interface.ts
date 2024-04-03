import { MongoHistory } from './base.types';
import { IProject, ProjectPosition } from './project.interface';
import { IUser } from './users.interface';

export interface IEmployment {
  _id: string;
  user: any;
  client: string | null;
  project: string | null | IProject;
  positionId: string;
  hireDate: string;
  fireDate: string;
  fireReason: string;
  comment: string;
  isNonTaxablePart: boolean;
  isChildTaxBonus: boolean;
  businessActivity: string;
  recruiter: string | Partial<IUser> | null;
  status?: 'hired' | 'fired' | 'canceled';
  changes: ProjectPositionChange[];
  history?: MongoHistory<IEmployment>[];
  createdBy: string | Partial<IUser> | null;
  updatedBy: string | Partial<IUser> | null;
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectPositionChange = {
  type: keyof ProjectPosition | null;
  data: any;
  dateFrom: string;
  createdBy: string;
  createdAt: string;
  matterId: string;
};
