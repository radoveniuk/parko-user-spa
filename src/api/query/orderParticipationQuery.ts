import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

export const useGetOrderParticipations = (params: Partial<IOrderParticipation> = {}, queryOptions: AnyObject = {}) => {
  const request = (): Promise<IOrderParticipation<true>[]> => api.get('/order-participations', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['orderParticipations', JSON.stringify(params)], request, { initialData: [], ...queryOptions });
};

export const useGetOrderParticipation = (id: string) => {
  const request = (): Promise<IOrderParticipation<true>> => api.get(`/order-participations/${id}`).then(res => res.data.data);
  return useQuery(['orderParticipation', id], request, { enabled: !!id });
};
