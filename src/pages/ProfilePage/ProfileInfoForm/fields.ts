import { UseFormWatch } from 'react-hook-form';
import { PERMIT_TYPES, SIZES } from 'constants/selectsOptions';
import { IUser } from 'interfaces/users.interface';

export type UserFormFields = Partial<IUser> & {
  passScancopy: File;
}

export type UserField = {
  type: 'string' | 'number' | 'boolean' | 'date' | 'file' | 'select';
  required?: boolean;
  visible?: (watch: UseFormWatch<IUser>) => boolean;
  getOptions?:() => string[]
}

export type UserFieldsList = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof Partial<IUser>]: UserField;
};

export type FieldSection = 'baseFields' | 'docsFields' | 'adressFields' | 'biometryFields' | 'expirienceFields' | 'familyFields' | 'slovakDocsFields';

const baseFields: UserFieldsList = {
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

const docsFields: UserFieldsList = {
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

export const slovakDocsFields: UserFieldsList = {
  hasPermit: {
    type: 'boolean',
  },
  permitType: {
    type: 'select',
    visible: (watch) => !!watch('hasPermit'),
    getOptions: () => PERMIT_TYPES,
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

export const adressFields: UserFieldsList = {
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
    type: 'string',
    required: true,
  },
};

export const biometryFields: UserFieldsList = {
  tshortSize: {
    type: 'select',
    getOptions: () => SIZES,
  },
  pantsSize: {
    type: 'select',
    getOptions: () => SIZES,
  },
  shoesSize: {
    type: 'string',
  },
};

export const expirienceFields: UserFieldsList = {
  study: {
    type: 'string',
  },
  speciality: {
    type: 'string',
  },
};

export const familyFields: UserFieldsList = {
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

// eslint-disable-next-line no-unused-vars
export const FIELDS: {[key in FieldSection]: UserFieldsList} = {
  baseFields,
  docsFields,
  slovakDocsFields,
  adressFields,
  biometryFields,
  expirienceFields,
  familyFields,
};
