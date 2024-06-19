import { IMongoDoc } from './base.types';

export interface IAccommodation extends IMongoDoc {
  email: string;
  comment: string;
  costNight: string;
  costMonth: string;
  tariff: string;
  adress: string;
  managerPhone: string;
  receptionPhone: string;
  name: string;
  businessName: string;
  ICO: string;
  calculationType: 'night' | 'day';
}
