import React, { ReactNode } from 'react';
import { Validate } from 'react-hook-form';
import StatusLabel from 'v2/uikit/StatusLabel';

import { validateEmail } from 'helpers/validateEmail';
import { AnyObject } from 'interfaces/base.types';
import { IUser } from 'interfaces/users.interface';

export type UserField = {
  type: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'multiselect' | 'dynamic-select' | 'phone' | 'textarea' | 'readonly';
  required?: boolean;
  validation?: Record<string, Validate<unknown, unknown>>;
  permissionRoles?: string[];
  selectProps?: AnyObject;
  render?: (data: any, t?: any) => ReactNode;
}

export type UserFieldsList = Record<(keyof Partial<IUser>)| string, UserField>;

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
    validation: {
      isEmail: (value) => !value || validateEmail(value as string),
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
    selectProps: {
      emptyItem: 'noSelected',
    },
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
    type: 'dynamic-select',
    selectProps: {
      emptyItem: 'noSelected',
    },
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
    selectProps: {
      emptyItem: 'noSelected',
    },
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
    selectProps: {
      emptyItem: 'noSelected',
    },
  },
  pantsSize: {
    type: 'select',
    selectProps: {
      emptyItem: 'noSelected',
    },
  },
  shoesSize: {
    type: 'number',
  },
};

export const WORK_FIELDS: UserFieldsList = {
  cooperationType: {
    type: 'dynamic-select',
    selectProps: {
      emptyItem: 'noSelected',
    },
  },
  position: {
    type: 'dynamic-select',
    selectProps: {
      emptyItem: 'noSelected',
    },
  },
  cooperationStartDate: {
    type: 'date',
  },
  cooperationEndDate: {
    type: 'date',
  },
  bankName: {
    type: 'string',
  },
  SWIFT: {
    type: 'string',
  },
  medicalInsurance: {
    type: 'select',
    selectProps: {
      emptyItem: 'noSelected',
    },
  },
  birthPlace: {
    type: 'string',
  },
  familyStatus: {
    type: 'select',
    selectProps: {
      emptyItem: 'noSelected',
    },
  },
  birthSurname: {
    type: 'string',
  },
  childrenCount: {
    type: 'number',
  },
  businessName: {
    type: 'string',
  },
  businessStatus: {
    type: 'select',
    selectProps: {
      emptyItem: 'noSelected',
    },
  },
  salary: {
    type: 'readonly',
    render: (data) => data ? `${Number(data).toFixed(2).toString().replace('.', ',')} €` : '',
  },
  salaryType: {
    type: 'readonly',
    render: (data) => data,
  },
  workTypes: {
    type: 'multiselect',
  },
};

export const SYSTEM_SETTINGS_FIELDS: UserFieldsList = {
  project: {
    type: 'readonly',
    render: (data) => `${data?.client?.name ? `${data?.client?.name} > ` : ''}${data?.name || ''}`,
  },
  status: {
    type: 'readonly',
    render: (data, t) => <StatusLabel className={`${data} column-content`}>{data && t(`selects.userStatus.${data}`)}</StatusLabel>,
  },
  role: {
    type: 'select',
  },
};

export const DOCS_FIELDS: UserFieldsList = {
  'pass.number': {
    type: 'string',
  },
  'pass.country': {
    type: 'dynamic-select',
  },
  'pass.dateFrom': {
    type: 'date',
  },
  'pass.dateTo': {
    type: 'date',
  },
  'pass.issuedBy': {
    type: 'string',
  },
  'visa.number': {
    type: 'string',
  },
  'visa.dateFrom': {
    type: 'date',
  },
  'visa.dateTo': {
    type: 'date',
  },
  'visa.comment': {
    type: 'string',
  },
  'idcard.number': {
    type: 'string',
  },
  'idcard.dateFrom': {
    type: 'date',
  },
  'idcard.dateTo': {
    type: 'date',
  },
  'idcard.country': {
    type: 'dynamic-select',
  },
  'permit.number': {
    type: 'string',
  },
  'permit.address': {
    type: 'string',
  },
  'permit.isMedicalCheck': {
    type: 'boolean',
  },
  'permit.dateFrom': {
    type: 'date',
  },
  'permit.dateTo': {
    type: 'date',
  },
  'permit.goal': {
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
  ...DOCS_FIELDS,
};

export type FieldSection = 'baseFields' |
'docsFields' | 'adressFields' | 'biometryFields' | 'expirienceFields' | 'familyFields' | 'slovakDocsFields' | 'scancopies';
