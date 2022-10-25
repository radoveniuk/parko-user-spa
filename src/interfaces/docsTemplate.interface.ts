import { IFile } from './file.interface';

export interface IDocsTemplate {
  _id?: string;
  name: string;
  // entity: 'user' | 'project';
  file: string | IFile;
  createdAt?: Date;
}
