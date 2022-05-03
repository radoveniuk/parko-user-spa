import { IUser } from 'interfaces/users.interface';
import { UseFormWatch } from 'react-hook-form';

export type UserFormFields = Partial<IUser> & {
  passScancopy: File;
}

export type UserField = {
  type: 'string' | 'number' | 'boolean' | 'date' | 'file' | 'select';
  required?: boolean;
  visible?: (watch: UseFormWatch<UserFormFields>) => boolean
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
    visible: (watch) => !!watch('hasInternationalPass'),
  },
  internationalPassExpire: {
    type: 'date',
    required: true,
    visible: (watch) => !!watch('hasInternationalPass'),
  },
  internationalPassAuthority: {
    type: 'string',
    required: true,
    visible: (watch) => !!watch('hasInternationalPass'),
  },
  hasIdCard: {
    type: 'boolean',
  },
  passNumber: {
    type: 'string',
    required: true,
    visible: (watch) => !watch('hasInternationalPass'),
  },
};

export const SLOVAK_DOCS_FIELDS: UserFieldsList = {
  hasPermit: {
    type: 'boolean',
  },
  permitType: {
    type: 'select',
    visible: (watch) => !!watch('hasPermit'),
  },
  permitExpire: {
    type: 'date',
    visible: (watch) => !!watch('hasPermit'),
  },
  rodneCislo: {
    type: 'string',
    visible: (watch) => !!watch('hasPermit'),
  },
  hasPrevPermit: {
    type: 'boolean',
  },
  IBAN: {
    type: 'string',
    required: true,
  },
  ICO: {
    type: 'string',
  },
};

export const ADRESS_FIELDS: UserFieldsList = {
  birthPlace: {
    type: 'string',
    required: true,
  },
  country: {
    type: 'string',
    required: true,
  },
  adress: {
    type: 'string',
    required: true,
  },
  city: {
    type: 'string',
    required: true,
  },
  zip: {
    type: 'boolean',
    required: true,
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
    type: 'string',
  },
};

export const EXPIRIENCE_FIELDS: UserFieldsList = {
  study: {
    type: 'string',
  },
  speciality: {
    type: 'string',
  },
};
export const FAMILY_FIELDS: UserFieldsList = {
  familyState: {
    type: 'select',
  },
  prevSurname: {
    type: 'string',
  },
  hasChildren: {
    type: 'boolean',
  },
  hasSiblings: {
    type: 'boolean',
  },
  motherName: {
    type: 'string',
  },
  motherSurname: {
    type: 'string',
  },
  motherPrevSurname: {
    type: 'string',
  },
  motherBirthdate: {
    type: 'date',
  },
  fatherName: {
    type: 'string',
  },
  fatherSurname: {
    type: 'string',
  },
  fatherBirthdate: {
    type: 'date',
  },
};
