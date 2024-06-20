import { IAccommodation } from './accommodation.interface';
import { IMongoDoc } from './base.types';
import { IClient } from './client.interface';
import { IProject } from './project.interface';

export interface IProjectAccommodation<T extends boolean = false> extends IMongoDoc {
  client: T extends true ? Pick<IClient, '_id' | 'shortName'> : string;
  project: T extends true ? Pick<IProject, '_id' | 'name'> : string;
  accommodation: T extends true ? Pick<IAccommodation, '_id' | 'name' | 'adress'> : string;
  damageCompencationPrice: number;
  damageCompencationTariff: number;
  reinvoicingPrice: number;
  reinvoicingTariff: number;
  payer: T extends true ? Pick<IClient, '_id' | 'shortName'> : string;
}
