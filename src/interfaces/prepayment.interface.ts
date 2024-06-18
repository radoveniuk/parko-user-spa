import { IMongoDoc } from './base.types';
import { IUser, IUserCurrentData } from './users.interface';

export type PrepaymentStatus = 'pending' | 'rejected' | 'approved' | 'paid';

export interface IPrepayment extends IMongoDoc, IUserCurrentData {
  user: string | Partial<IUser>;
  sum: string | number;
  status: PrepaymentStatus;
  paymentDate: string | null;
  createdByRole: 'user' | 'admin';
  userComment?: string;
  adminComment?: string;
  period: string;
}
