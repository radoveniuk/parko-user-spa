import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IOrder } from 'interfaces/order.interface';

export const useGetOrders = (params: Partial<IOrder> = {}, queryOptions: AnyObject = {}) => {
  const request = (): Promise<IOrder<true>[]> => api.get('/orders', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['orders', JSON.stringify(params)], request, { initialData: [], ...queryOptions });
};

export const useGetOrder = (id: string) => {
  const request = (): Promise<IOrder<true>> => api.get(`/orders/${id}`).then(res => res.data.data);
  return useQuery(['order', id], request, { enabled: !!id });
};
