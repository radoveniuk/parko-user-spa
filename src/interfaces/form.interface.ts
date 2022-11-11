import { IDictionary } from './dictionary.interface';

export type CustomFormEntity = 'user' | 'project';

export type CustomFormFieldType = 'string' | 'number' | 'date' | 'boolean' | 'phone' | 'email' | 'select'

export interface ICustomFormField {
  _id: string;
  names: Record<string, string>;
  entity: CustomFormEntity;
  type: CustomFormFieldType;
  source?: string | IDictionary;
  required: boolean;
  section: string | null;
  projects: string[];
}

export interface ICustomFormSection {
  _id?: string;
  names: Record<string, string>;
  entity: CustomFormEntity;
  order: number;
}
