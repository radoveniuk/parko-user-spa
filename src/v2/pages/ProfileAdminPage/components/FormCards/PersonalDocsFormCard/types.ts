export type DocType = 'pass' | 'permit' | 'visa';

type BaseDoc = {
  type: DocType;
  number: string;
  dateFrom: string;
  dateTo: string;
};

export type PassInfo = BaseDoc & {
  country: string;
  issuedBy: string;
};

export type PermitInfo = BaseDoc & {
  goal: string;
  id: string;
  address: string;
  isMedicalCheck: boolean;
};

export type VisaInfo = BaseDoc & {
  comment: string;
};
