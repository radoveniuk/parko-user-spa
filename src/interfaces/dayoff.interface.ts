import { IMongoDoc } from './base.types';
import { IFile } from './file.interface';
import { IUser, IUserCurrentData } from './users.interface';

export interface IDayOff extends IMongoDoc, IUserCurrentData {
  user: string | IUser;
  dateStart: string;
  dateEnd: string;
  reason: string;
  description?: string;
  adminComment?: string;
  isApproved?: boolean | null;
  docs?: IFile[] | string[];
}
