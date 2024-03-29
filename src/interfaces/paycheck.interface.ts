import { IFile } from './file.interface';
import { IUser } from './users.interface';

export interface IPaycheck {
  _id: string;
  user: string | IUser;
  project: string;
  date: string;
  comment?: string;
  linkedFile: string | IFile;
  createdAt?: string;
  updatedAt?: string;
}
