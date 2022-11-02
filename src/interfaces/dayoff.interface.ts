import { INewUser } from './users.interface';

export interface IDayOff {
  _id: string;
  user: string | INewUser;
  dateStart: string;
  dateEnd: string;
  reason: string;
  description?: string;
  adminComment?: string;
  isApproved: boolean | null;
  createdAt?: Date;
}
