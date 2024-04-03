import { IUser } from './users.interface';

export type PrepaymentStatus = 'pending' | 'rejected' | 'approved' | 'paid';

export interface IPrepayment {
  _id: string;
  user: string | Partial<IUser>;
  sum: string | number;
  status: PrepaymentStatus;
  paymentDate: string | null;
  createdByRole: 'user' | 'admin';
  userComment?: string;
  adminComment?: string;
  period: string;
  createdAt?: string;
  createdBy?: Partial<IUser>;
  updatedBy?: Partial<IUser>;
}
