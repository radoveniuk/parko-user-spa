import { IAccommodation } from './accommodation.interface';
import { IUser } from './users.interface';

export interface IResidence {
  _id: string;
  user: string | IUser;
  accommodation: string | IAccommodation;
  checkInDate: string | null;
  checkOutDate: string | null;
}
