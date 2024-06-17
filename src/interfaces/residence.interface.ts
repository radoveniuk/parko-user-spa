import { IAccommodation } from './accommodation.interface';
import { IMongoDoc } from './base.types';
import { IUser, IUserCurrentData } from './users.interface';

export interface IResidence extends IMongoDoc, IUserCurrentData {
  user: string | IUser;
  accommodation: string | IAccommodation;
  checkInDate: string | null;
  checkOutDate: string | null;
}
