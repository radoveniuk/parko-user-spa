import { Validate } from 'react-hook-form';

import { validateEmail } from 'helpers/validateEmail';
import { IUser } from 'interfaces/users.interface';

export type UserField = {
  type: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'dynamic-select' | 'phone' | 'textarea';
  required?: boolean;
  validation?: Record<string, Validate<unknown>>;
  permissionRoles?: string[];
}

export type UserFieldsList = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof Partial<IUser>]: UserField;
};

export const BASE_FIELDS: UserFieldsList = {
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
    type: 'string',
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
    permissionRoles: ['admin', 'recruiter'],
  },
  notes: {
    type: 'textarea',
    permissionRoles: ['admin', 'recruiter'],
  },
};

export const ADRESS_FIELDS: UserFieldsList = {
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

export const SYSTEM_FIELDS: UserFieldsList = {
  recruiter: {
    type: 'dynamic-select',
  },
  source: {
    type: 'dynamic-select',
  },
};

export const PERMIT_FIELDS: UserFieldsList = {
  hasPermit: {
    type: 'boolean',
  },
  rodneCislo: {
    type: 'string',
  },
  permitType: {
    type: 'dynamic-select',
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

export const BUSINESS_FIELDS: UserFieldsList = {
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

export const BIOMETRY_FIELDS: UserFieldsList = {
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

export const WORK_FIELDS: UserFieldsList = {
  cooperationType: {
    type: 'dynamic-select',
  },
  position: {
    type: 'dynamic-select',
  },
  cooperationStartDate: {
    type: 'date',
  },
  cooperationEndDate: {
    type: 'date',
  },
};

const SYSTEM_SETTINGS_FIELDS: UserFieldsList = {
  project: {
    type: 'dynamic-select',
  },
  status: {
    type: 'select',
  },
  role: {
    type: 'select',
  },
};

export const ALL_FORM_FIELDS = {
  ...BASE_FIELDS,
  ...ADRESS_FIELDS,
  ...SYSTEM_FIELDS,
  ...PERMIT_FIELDS,
  ...BUSINESS_FIELDS,
  ...BIOMETRY_FIELDS,
  ...WORK_FIELDS,
  ...SYSTEM_SETTINGS_FIELDS,
};

export type FieldSection = 'baseFields' |
'docsFields' | 'adressFields' | 'biometryFields' | 'expirienceFields' | 'familyFields' | 'slovakDocsFields' | 'scancopies';
