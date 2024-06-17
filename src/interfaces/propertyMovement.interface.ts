import { IMongoDoc } from './base.types';
import { IClient } from './client.interface';
import { IProject } from './project.interface';
import { IProperty } from './property.interface';
import { IUser, IUserCurrentData } from './users.interface';

export type PropertyMovementType = 'give' | 'return' | 'writeoff';

export interface IPropertyMovement<T extends boolean = false> extends IMongoDoc, IUserCurrentData {
  type: PropertyMovementType;
  user: T extends true ? Pick<IUser, '_id' | 'fullname'> : string;
  project: T extends true ? Pick<IProject, '_id' | 'name'> : string;
  client: T extends true ? Pick<IClient, '_id' | 'shortName'> : string;
  contractor?: T extends true ? Pick<IClient, '_id' | 'shortName'> : string;
  // eslint-disable-next-line max-len
  property: T extends true ? Pick<IProperty<true>, '_id' | 'internalName' | 'count' | 'damageCompencationPrice' | 'distributorICO' | 'price' | 'orderer' | 'receiver' | 'availableCount'> : string;
  previousMovement?: T extends true ? Omit<IPropertyMovement<true>, 'previousMovement'> : string;
  isReturned?: boolean;
  count: number;
  date: string;
  recorder: T extends true ? Pick<IUser, '_id' | 'fullname'> : string;
  writeoffReason: string;
  damageCompencationPrice: number;
}
