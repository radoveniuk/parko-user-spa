import { IFile } from './file.interface';
import { IUser } from './users.interface';

export interface IPaycheck {
  _id: string;
  user: string | IUser;
  project: string;
  date: string;
  linkedFile: string | IFile;
  createdAt?: string;
}
