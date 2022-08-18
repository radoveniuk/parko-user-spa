import { UseFormWatch, Validate } from 'react-hook-form';
import { IUser } from 'interfaces/users.interface';

import { validateEmail } from 'helpers/validateEmail';

export type UserFormFields = Partial<IUser> & {
  passScancopy: File;
}

export type UserField = {
  type: 'string' | 'number' | 'boolean' | 'date' | 'file' | 'select' | 'form' | 'phone';
  required?: boolean;
  visible?: (watch: UseFormWatch<IUser>) => boolean;
  validation?: Record<string, Validate<unknown>>
}

export type UserFieldsList = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof Partial<IUser>]: UserField;
};

export type FieldSection = 'baseFields' |
'docsFields' | 'adressFields' | 'biometryFields' | 'expirienceFields' | 'familyFields' | 'slovakDocsFields' | 'scancopies';

const baseFields: UserFieldsList = {
  email: {
    type: 'string',
    required: true,
    validation: {
      isEmail: (value) => validateEmail(value as string),
    },
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
    type: 'phone',
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
    visible: (watch) => watch('hasInternationalPass'),
  },
  internationalPassExpire: {
    type: 'date',
    required: true,
    visible: (watch) => watch('hasInternationalPass') && !watch('hasPermit'),
  },
  internationalPassAuthority: {
    type: 'string',
    required: true,
    visible: (watch) => watch('hasInternationalPass') && !watch('hasPermit'),
  },
  passNumber: {
    type: 'string',
    required: true,
    visible: (watch) => !watch('hasInternationalPass'),
  },
  hasIdCard: {
    type: 'boolean',
  },
};

export const slovakDocsFields: UserFieldsList = {
  hasPermit: {
    type: 'boolean',
  },
  permitType: {
    type: 'select',
    visible: (watch) => watch('hasPermit'),
  },
  permitExpire: {
    type: 'date',
    visible: (watch) => watch('hasPermit'),
  },
  rodneCislo: {
    type: 'string',
    visible: (watch) => watch('hasPermit'),
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
    required: true,
    visible: (watch) => watch('permitType') === 'business',
  },
};

export const scancopies: UserFieldsList = {
  internationalPassScan: {
    type: 'file',
    visible: (watch) => watch('hasInternationalPass'),
  },
  passScan: {
    type: 'file',
    visible: (watch) => !watch('hasInternationalPass'),
  },
  idCardFaceScan: {
    type: 'file',
    visible: (watch) => watch('hasIdCard'),
  },
  idCardBackScan: {
    type: 'file',
    visible: (watch) => watch('hasIdCard'),
  },
  permitFaceScan: {
    type: 'file',
    visible: (watch) => watch('hasPermit'),
  },
  permitBackScan: {
    type: 'file',
    visible: (watch) => watch('hasPermit'),
  },
};

export const adressFields: UserFieldsList = {
  birthPlace: {
    type: 'string',
    required: true,
  },
  country: {
    type: 'select',
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
  },
  pantsSize: {
    type: 'select',
  },
  shoesSize: {
    type: 'number',
  },
};

export const expirienceFields: UserFieldsList = {
  study: {
    type: 'select',
    visible: (watch) => !watch('hasPermit'),
  },
  speciality: {
    type: 'string',
    visible: (watch) => !watch('hasPermit'),
  },
};

export const familyFields: UserFieldsList = {
  familyState: {
    type: 'select',
    visible: (watch) => !watch('hasPermit'),
  },
  prevSurname: {
    type: 'string',
    visible: (watch) => !watch('hasPermit'),
  },
  hasChildren: {
    type: 'boolean',
    visible: (watch) => !watch('hasPermit'),
  },
  childrenJson: {
    type: 'form',
    visible: (watch) => !watch('hasPermit') && watch('hasChildren'),
  },
  hasSiblings: {
    type: 'boolean',
    visible: (watch) => !watch('hasPermit'),
  },
  siblingsJson: {
    type: 'form',
    visible: (watch) => !watch('hasPermit') && watch('hasSiblings'),
  },
  motherName: {
    type: 'string',
    visible: (watch) => !watch('hasPermit'),
  },
  motherSurname: {
    type: 'string',
    visible: (watch) => !watch('hasPermit'),
  },
  motherPrevSurname: {
    type: 'string',
    visible: (watch) => !watch('hasPermit'),
  },
  motherBirthdate: {
    type: 'date',
    visible: (watch) => !watch('hasPermit'),
  },
  fatherName: {
    type: 'string',
    visible: (watch) => !watch('hasPermit'),
  },
  fatherSurname: {
    type: 'string',
    visible: (watch) => !watch('hasPermit'),
  },
  fatherBirthdate: {
    type: 'date',
    visible: (watch) => !watch('hasPermit'),
  },
};

// eslint-disable-next-line no-unused-vars
export const FIELDS: {[key in FieldSection]: UserFieldsList} = {
  baseFields,
  docsFields,
  slovakDocsFields,
  scancopies,
  adressFields,
  biometryFields,
  expirienceFields,
  familyFields,
};

export const ADMIN_FIELDS: {[key: string]: UserFieldsList} = {
  baseFields,
};
