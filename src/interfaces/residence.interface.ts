import { IAccommodation } from './accommodation.interface';
import { IMongoDoc } from './base.types';
import { IClient } from './client.interface';
import { IProject } from './project.interface';
import { IUser, UserWorkType } from './users.interface';

export interface IResidence extends IMongoDoc {
  user: string | IUser;
  accommodation: string | IAccommodation;
  checkInDate: string | null;
  checkOutDate: string | null;
  project: string | IProject;
  client: string | IClient;
  userFullname: string;
  userWorkTypes: UserWorkType[];
  userStatus: string;
  userCooperationStartDate: Date;
  userCooperationEndDate: Date;
  createdBy?: Partial<IUser>;
  updatedBy?: Partial<IUser>;
}
