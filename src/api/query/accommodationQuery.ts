import { useQuery } from 'react-query';

import api from 'api/common';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { AnyObject } from 'interfaces/base.types';

export const useGetAccommodations = (params: Partial<IAccommodation> = {}, options: AnyObject = {}) => {
  const request = (): Promise<IAccommodation[]> => api.get('/accommodations', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['accommodations', JSON.stringify(params)], request, { staleTime: 300_000, ...options });
};

export const useGetAccommodation = (id: string) => {
  const request = (): Promise<IAccommodation> => api.get(`/accommodations/${id}`).then(res => res.data.data);
  return useQuery(['accommodation', id], request, { enabled: !!id });
};
