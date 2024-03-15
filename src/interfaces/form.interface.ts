export type CustomFormEntity = 'user' | 'project';

export type CustomFormFieldType = 'string' | 'number' | 'date' | 'boolean' | 'phone' | 'email' | 'select' | 'multiselect';

export interface ICustomFormField {
  _id: string;
  names: Record<string, string>;
  type: CustomFormFieldType;
  options: string[];
  createdAt: string;
}

export interface ICustomFormSection {
  _id?: string;
  names: Record<string, string>;
  entity: CustomFormEntity;
  order: number;
}
