import { IUser } from 'interfaces/users.interface';

export type UserField = {
  type: 'string' | 'number' | 'boolean' | 'date' | 'file' | 'select';
  required?: boolean;
}

export type UserFieldsList = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof Partial<IUser>]: UserField;
};

export const PROFILE_BASE_FIELDS: UserFieldsList = {
  email: {
    type: 'string',
    required: true,
  },
  name: {
    type: 'string',
    required: true,
  },
  surname: {
    type: 'string',
    required: true,
  },
  password: {
    type: 'string',
    required: true,
  },
  phone: {
    type: 'string',
    required: true,
  },
  birthDate: {
    type: 'date',
    required: true,
  },
};

export const PROFILE_DOCS_FIELDS: UserFieldsList = {
  hasInternationalPass: {
    type: 'boolean',
    required: true,
  },
  internationalPassNumber: {
    type: 'string',
    required: true,
  },
  internationalPassExpire: {
    type: 'date',
    required: true,
  },
  internationalPassAuthority: {
    type: 'string',
    required: true,
  },
  hasIdCard: {
    type: 'boolean',
  },
  passNumber: {
    type: 'string',
    required: true,
  },
};
