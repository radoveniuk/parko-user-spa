import { PrepaymentStatus } from 'interfaces/prepayment.interface';

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export const PERMIT_TYPES = [
  'business',
  'study',
  'work',
  'temporaryShelter',
  'familyReunification',
];

export const FAMILY_STATUSES = [
  'married',
  'single',
];

export const STUDY = [
  'base',
  'middleFull',
  'middleSpecial',
  'high',
];

export const PROJECT_TARIFF_TYPE = [
  'candidate',
  'hour',
  'month',
];

export const ACCOMMODATION_TARIFF_TYPE = [
  'night',
  'month',
];

export const ACCOMMODATION_CALCULATION_TYPE = [
  'night',
  'day',
];

export const EMPLOYMENT_TYPE = [
  'self',
  'fullTime',
  'partTime',
  'sideJob',
];

export const SALARY_TYPE = [
  'month',
  'hour',
];

export const USER_SCAN_TYPE = [
  'internationalPassScan',
  'passScan',
  'idCardFaceScan',
  'idCardBackScan',
  'permitFaceScan',
  'permitBackScan',
  'other',
];

export const CLIENT_STATUS = [
  'contacted',
  'potential',
  'negotiation',
  'development',
  'active',
  'inactive',
  'rejected',
];

export const PROJECT_STATUS = [
  'active',
  'inactive',
];

export const PREPAYMENT_STATUS: PrepaymentStatus[] = [
  'pending',
  'approved',
  'rejected',
  'paid',
];

export const INSURANCE = [
  'Union',
  'VŠZP',
  'Dôvera',
];

export const CORPORATE_BODY_STATUS = [
  'active',
  'stopped',
  'closed',
];

export const ORDER_STATUS = [
  'recruiting',
  'processing',
  'finished',
];

export const ORDER_COOPERATION_TYPE = [
  'outsourcing',
  'leasing',
  'mediation',
];

export const EXPIRIENCE_METHOD_OPTIONS = [
  { value: 'terminationDuringProbationPeriod', label: 'Ukončením v skúšobnej dobe' },
  { value: 'byNotice', label: 'Výpoveďou' },
  { value: 'byAgreement', label: 'Dohodou' },
  { value: 'nonRenewalOfContract', label: 'Nepredlženie zmluvy' },
  { value: 'immediateTerminationOfEmployment', label: 'Okamžitým skončením pracovného pomeru' },
  { value: 'terminationOfResidencePermit/Visa', label: 'Skončením platnosti pobytu/víza' },
  { value: 'terminationOfBusiness', label: 'Skončenie s podnikaním' },
];
