import { IUser } from './users.interface';

export interface IPrepayment {
  _id: string;
  user: string | Partial<IUser>;
  sum: string | number;
  isApproved: boolean | null;
  createdAt?: string;
  userComment?: string;
  adminComment?: string;
}
