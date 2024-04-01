export type CustomFormEntity = 'user' | 'project';

export type CustomFormFieldType = 'string' | 'number' | 'date' | 'boolean' | 'phone' | 'email' | 'select' | 'multiselect' | 'expirience' | 'textarea';

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
  createdAt: string;
}

export interface ICustomForm {
  _id?: string;
  name: string;
  fields: (ICustomFormField | string)[];
  requiredFields: string[];
  createdAt: string;
}

export interface ICustomFormFieldSectionBinding<T extends boolean = false> {
  _id: string;
  field: T extends true ? ICustomFormField : string;
  section: T extends true ? ICustomFormSection : string;
  isRequired: boolean;
  createdAt: string;
}
