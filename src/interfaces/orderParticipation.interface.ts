import { IMongoDoc } from './base.types';
import { IOrder, IOrderStage } from './order.interface';
import { IUser } from './users.interface';

export interface IOrderParticipationStage {
  stage: IOrderStage;
  date: string;
  comment: string;
  createdByName: string;
}

export interface IOrderParticipation<T extends boolean = false> extends IMongoDoc {
  user: T extends true ? Partial<IUser> : string;
  order: T extends true ? IOrder<true> : string;
  screaning: Record<string, any>;
  stages: IOrderParticipationStage[];
  comment: string;
}
