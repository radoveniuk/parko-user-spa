import { IMongoDoc } from './base.types';

export interface IRole extends IMongoDoc {
  name: string;
  permissions: string[];
}
