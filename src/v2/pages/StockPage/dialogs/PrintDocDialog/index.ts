import { IUser } from 'interfaces/users.interface';

export type UserData = Omit<IUser, '_id' | 'name' | 'surname'>;
export { default } from './PrintDocDialog';
