/* eslint-disable camelcase */
type CorporateBodyStatus = 'active' | 'stopped' | 'closed';

export interface ICorporateBody {
  portalId: string,
  name: string,
  companyName: string,
  cin: string,
  businessAddress: string,
  address?: string,
  status?: CorporateBodyStatus,
  activities?: {
    description: string,
    effective_from: string,
    effective_to: null | string,
    status: CorporateBodyStatus,
  }[],
  isSlovak?: false,
  type?: 'individual',
  register?: string
  registerNumber?: string
};
