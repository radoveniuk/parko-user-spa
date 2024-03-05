/* eslint-disable camelcase */
import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';

export type AddressSuggestion = {
  description: string;
  city?: string;
  houseRegNumber?: string;
  street?: string;
  houseNumber?: string;
  zip?: string;
  place_id?: string;
};

export const useGetSuggestions = (text: string, country?: string, params: AnyObject = {}) => {
  const request = (): Promise<AddressSuggestion[]> => api.get(`/api/address/${text.replaceAll('/', '%2F')}}`, { params: { country } }).then(res => res.data.data);
  return useQuery(['addressSuggestions', text], request, params);
};
