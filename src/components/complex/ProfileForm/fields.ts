import { Validate } from 'react-hook-form';

import { validateEmail } from 'helpers/validateEmail';
import { IUser2 } from 'interfaces/users.interface';

export type UserField = {
  type: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'phone' | 'textarea';
  required?: boolean;
  validation?: Record<string, Validate<unknown>>;
  permissionRoles?: string[];
}

export type UserFieldsList = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof Partial<IUser2>]: UserField;
};

const baseFields: UserFieldsList = {
  name: {
    type: 'string',
    required: true,
  },
  surname: {
    type: 'string',
    required: true,
  },
  email: {
    type: 'string',
    required: true,
    validation: {
      isEmail: (value) => validateEmail(value as string),
    },
  },
  birthDate: {
    type: 'date',
  },
  passNumber: {
    type: 'select',
  },
  phone: {
    type: 'phone',
    required: true,
  },
  sex: {
    type: 'select',
  },
  IBAN: {
    type: 'string',
  },
  blocked: {
    type: 'boolean',
    permissionRoles: ['admin', 'reqruiter'],
  },
  notes: {
    type: 'textarea',
    permissionRoles: ['admin', 'reqruiter'],
  },
};

export const adressFields: UserFieldsList = {
  adress: {
    type: 'string',
  },
  zip: {
    type: 'string',
  },
  city: {
    type: 'string',
  },
  country: {
    type: 'select',
  },
};

export const systemFields: UserFieldsList = {
  recruiter: {
    type: 'select',
  },
  source: {
    type: 'select',
  },
};

export const permitFields: UserFieldsList = {
  hasPermit: {
    type: 'boolean',
  },
  rodneCislo: {
    type: 'string',
  },
  permitType: {
    type: 'select',
  },
  permitStartDate: {
    type: 'date',
  },
  permitExpire: {
    type: 'date',
  },
  hasMedicalExamination: {
    type: 'boolean',
  },
};

export const businessFields: UserFieldsList = {
  ICO: {
    type: 'string',
  },
  DIC: {
    type: 'string',
  },
  permitAdress: {
    type: 'string',
  },
  permitDepartment: {
    type: 'string',
  },
  permitNumber: {
    type: 'string',
  },
};

export const biometryFields: UserFieldsList = {
  tshortSize: {
    type: 'select',
  },
  pantsSize: {
    type: 'select',
  },
  shoesSize: {
    type: 'number',
  },
};

export const workFields: UserFieldsList = {
  employmentType: {
    type: 'select',
  },
  position: {
    type: 'string',
  },
  cooperationStartDate: {
    type: 'date',
  },
  cooperationEndDate: {
    type: 'date',
  },
};

export type FieldSection = 'baseFields' |
'docsFields' | 'adressFields' | 'biometryFields' | 'expirienceFields' | 'familyFields' | 'slovakDocsFields' | 'scancopies';

// eslint-disable-next-line no-unused-vars
export const SECTIONS: {[key: string]: UserFieldsList} = {
  baseFields,
  adressFields,
  systemFields,
  permitFields,
  businessFields,
  biometryFields,
  workFields,
};
