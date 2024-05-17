import { IMongoDoc } from './base.types';
import { IClient } from './client.interface';
import { IProject } from './project.interface';
import { IProperty } from './property.interface';
import { IUser } from './users.interface';

export type PropertyMovementType = 'give' | 'return' | 'writeoff';

export interface IPropertyMovement<T extends boolean = false> extends IMongoDoc {
  type: PropertyMovementType;
  user: T extends true ? Pick<IUser, '_id' | 'fullname'> : string;
  project: T extends true ? Pick<IProject, '_id' | 'name'> : string;
  client: T extends true ? Pick<IClient, '_id' | 'shortName'> : string;
  contractor: T extends true ? Pick<IClient, '_id' | 'shortName'> : string;
  userCooperationType: string;
  userStatus: string;
  userCooperationStartDate: string;
  property: T extends true ? Pick<IProperty, '_id' | 'internalName' | 'count' | 'damageCompencationPrice'> : string;
  previousMovement?: T extends true ? IPropertyMovement<true> : string;
  isReturned?: boolean;
  count: number;
  date: string;
  userCooperationEndDate: string;
  recorder: T extends true ? Pick<IUser, '_id' | 'fullname'> : string;
  writeoffReason: string;
  damageCompencationPrice: number;
  createdBy: T extends true ? Pick<IUser, '_id' | 'fullname'> : string;
  updatedBy: T extends true ? Pick<IUser, '_id' | 'fullname'> : string;
}
