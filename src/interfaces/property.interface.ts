import { IMongoDoc } from './base.types';
import { IClient } from './client.interface';
import { IUser } from './users.interface';

export type PropertyStatus = 'available' | 'ordered' | 'out';

export interface IProperty<T extends boolean = false> extends IMongoDoc {
  internalName: string;
  distributorICO: string;
  tradeName: string;
  invoiceDeliveryDate: string;
  deliveryDate: string;
  invoiceNumber: string;
  category: string;
  status: PropertyStatus;
  size: string;
  location: string;
  count: number;
  comment: string;
  identification: string;
  availableCount: number;
  price: number;
  damageCompencationPrice: number;
  orderer: T extends true ? Pick<IClient, '_id' | 'shortName'> : string;
  receiver: T extends true ? Pick<IUser, '_id' | 'fullname'> : string;
  createdBy: T extends true ? Pick<IUser, '_id' | 'fullname'> : string;
  updatedBy: T extends true ? Pick<IUser, '_id' | 'fullname'> : string;
}
