export type CustomFormEntity = 'user' | 'project';

export type CustomFormFieldType = 'string' | 'number' | 'date' | 'boolean' | 'phone' | 'email'

export interface ICustomFormField {
  _id: string;
  names: Record<string, string>;
  entity: CustomFormEntity;
  type: CustomFormFieldType;
  required: boolean;
  section: string | null;
  projects: string[] | string;
}

export interface ICustomFormSection {
  _id?: string;
  names: Record<string, string>;
  entity: CustomFormEntity;
  order: number;
}
