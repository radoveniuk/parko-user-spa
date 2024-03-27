import { IMongoDoc } from './base.types';
import { IOrder, IOrderStage } from './order.interface';
import { IUser } from './users.interface';

export interface IOrderParticipationStage {
  stage: IOrderStage;
  date: string;
  comment: string;
}

export interface IOrderParticipation<T extends boolean = false> extends IMongoDoc {
  user: T extends true ? IUser : string;
  order: T extends true ? IOrder<true> : string;
  screaning: Record<string, any>;
  stages: IOrderParticipationStage[];
  createdBy: T extends true ? IUser : string;
  updatedBy: string | null;
}
