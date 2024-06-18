import { IDocsTemplateCategory } from './docsTemplateCategory.interface';
import { IFile } from './file.interface';
import { IUser } from './users.interface';

export interface IDocsTemplate {
  _id?: string;
  name: string;
  // entity: 'user' | 'project';
  file: string | IFile | File;
  createdAt?: Date;
  category?: string | IDocsTemplateCategory;
  createdBy?: Partial<IUser>;
  updatedBy?: Partial<IUser>;
}
