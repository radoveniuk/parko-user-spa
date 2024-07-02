import { UserPersonalDocType } from 'interfaces/users.interface';

type BaseDoc = {
  type: UserPersonalDocType;
  number: string;
  dateFrom: string;
  dateTo: string;
};

export type PassInfo = BaseDoc & {
  country: string;
  address?: string;
};

export type IntPassInfo = PassInfo & {
  issuedBy: string;
};

export type PermitInfo = BaseDoc & {
  goal: string;
  address: string;
  isMedicalCheck: boolean;
};

export type LongTermStayInfo = BaseDoc & {
  address: string;
};

export type VisaInfo = BaseDoc & {
  comment: string;
};
