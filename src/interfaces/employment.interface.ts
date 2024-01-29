import { MongoHistory } from './base.types';
import { ProjectPosition } from './project.interface';
import { IUser } from './users.interface';

export interface IEmployment {
  _id: string;
  user: any;
  client: string | null;
  project: string | null;
  positionId: string;
  hireDate: string;
  fireDate: string;
  fireReason: string;
  comment: string;
  isNonTaxablePart: boolean;
  isChildTaxBonus: boolean;
  status?: 'hired' | 'fired' | 'canceled';
  changes: Partial<ProjectPosition>;
  history?: MongoHistory<IEmployment>[];
  createdBy: string | Partial<IUser> | null;
  updatedBy: string | Partial<IUser> | null;
  createdAt?: string;
  updatedAt?: string;
}
