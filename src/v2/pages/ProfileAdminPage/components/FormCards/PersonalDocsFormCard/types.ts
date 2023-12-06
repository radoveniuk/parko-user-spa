import { UserPersonalDocType } from 'interfaces/users.interface';

type BaseDoc = {
  type: UserPersonalDocType;
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
