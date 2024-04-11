import { IMongoDoc } from './base.types';
import { IFile } from './file.interface';

export type CustomFormEntity = 'user' | 'project';

export type CustomFormFieldType = 'string' | 'number' | 'date' | 'boolean' | 'phone' | 'email' | 'select' | 'multiselect' | 'experience' | 'textarea';

export interface ICustomFormField extends IMongoDoc {
  names: Record<string, string>;
  type: CustomFormFieldType;
  options: string[];
}

export interface ICustomFormSection extends IMongoDoc {
  names: Record<string, string>;
  entity: CustomFormEntity;
}

export interface ICustomForm extends IMongoDoc {
  name: string;
  fields: (ICustomFormField | string)[];
  requiredFields: string[];
  summaryTemplate: string | IFile | null;
}

export interface ICustomFormFieldSectionBinding<T extends boolean = false> extends IMongoDoc {
  field: T extends true ? ICustomFormField : string;
  section: T extends true ? ICustomFormSection : string;
  isRequired: boolean;
}
