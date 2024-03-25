import { useMutation } from 'react-query';

import api from 'api/common';
import { IOrder } from 'interfaces/order.interface';

export const useCreateOrder = () => {
  const request = (data: IOrder) => api.post('/orders', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateOrder = () => {
  const request = (data: IOrder) => api.put(`/orders/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteOrder = () => {
  const request = (id: string) => api.delete(`/orders/${id}`).then(res => res.data.data);
  return useMutation(request);
};
