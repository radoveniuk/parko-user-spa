import { IMongoDoc } from './base.types';
import { IClient } from './client.interface';
import { IProject } from './project.interface';
import { IUser } from './users.interface';

export type PrepaymentStatus = 'pending' | 'rejected' | 'approved' | 'paid';

export interface IPrepayment extends IMongoDoc {
  user: string | Partial<IUser>;
  sum: string | number;
  status: PrepaymentStatus;
  paymentDate: string | null;
  createdByRole: 'user' | 'admin';
  userComment?: string;
  adminComment?: string;
  period: string;
  project?: string | IProject;
  client?: string | IClient;
  userFullname?: string;
  userWorkTypes?: string[];
  userStatus?: string;
  userCooperationStartDate?: string;
  userCooperationEndDate?: string;
  createdBy?: Partial<IUser>;
  updatedBy?: Partial<IUser>;
}
