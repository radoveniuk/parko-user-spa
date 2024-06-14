import { IMongoDoc } from './base.types';
import { IClient } from './client.interface';
import { IFile } from './file.interface';
import { IProject } from './project.interface';
import { IUser, UserWorkType } from './users.interface';

export interface IDayOff extends IMongoDoc {
  user: string | IUser;
  dateStart: string;
  dateEnd: string;
  reason: string;
  description?: string;
  adminComment?: string;
  isApproved?: boolean | null;
  docs?: IFile[] | string[];
  project?: string | IProject;
  client?: string | IClient;
  userFullname?: string;
  userWorkTypes?: UserWorkType[];
  userStatus?: string;
  userCooperationStartDate?: Date;
  userCooperationEndDate?: Date;
  createdBy?: Partial<IUser>;
  updatedBy?: Partial<IUser>;
}
