import { IFile } from './file.interface';
import { IUser } from './users.interface';

export interface IDayOff {
  _id: string;
  user: string | IUser;
  dateStart: string;
  dateEnd: string;
  reason: string;
  description?: string;
  adminComment?: string;
  isApproved?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
  docs: IFile[] | string[];
}
