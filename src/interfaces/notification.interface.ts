export interface INotification {
  _id?: string;
  from: 'admin' | 'system' | string;
  to: string;
  title: string;
  message: string;
  entityType: 'prepayment' | 'dayoff' | 'paycheck';
  linkedDoc: string;
  viewed: boolean;
  createdAt?: Date;
}
