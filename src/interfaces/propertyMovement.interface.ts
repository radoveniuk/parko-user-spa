import { IMongoDoc } from './base.types';
import { IClient } from './client.interface';
import { IProject } from './project.interface';
import { IProperty } from './property.interface';
import { IUser } from './users.interface';

export interface IPropertyMovement<T extends boolean = false> extends IMongoDoc {
  type: 'give' | 'return' | 'writeoff';
  user: T extends true ? Partial<IUser> : string;
  project: T extends true ? Partial<IProject> : string;
  client: T extends true ? Partial<IClient> : string;
  contractor: T extends true ? Partial<IClient> : string;
  userCooperationType: string;
  userStatus: string;
  userCooperationStartDate: string;
  property: T extends true ? Partial<IProperty> : string;
  count: number;
  date: Date;
  recorder: T extends true ? Partial<IUser> : string;
  writeoffReason: string;
  damageCompencationPrice: number;
  createdBy: T extends true ? Partial<IUser> : string;
  updatedBy: T extends true ? Partial<IUser> : string;
}
