export interface INotification {
  _id: string;
  from: 'admin' | 'system' | string;
  to: string;
  title: string;
  message: string;
  entityType: INotificationEntity;
  linkedDoc: string;
  viewed: boolean;
  createdAt?: Date;
}

export type INotificationEntity = 'prepayment' | 'dayoff' | 'paycheck';
