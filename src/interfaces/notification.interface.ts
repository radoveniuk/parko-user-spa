import { IUser } from './users.interface';

export interface INotification {
  _id: string;
  from: 'admin' | 'system' | string | IUser;
  to: string | IUser;
  title: string;
  message: string;
  entityType?: INotificationEntity;
  linkedDoc?: string;
  viewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type INotificationEntity = 'prepayment' | 'dayoff' | 'paycheck' | 'mail';
