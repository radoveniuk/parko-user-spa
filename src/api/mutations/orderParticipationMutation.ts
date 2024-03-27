import { useMutation } from 'react-query';

import api from 'api/common';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

export const useCreateOrderParticipation = () => {
  const request = (data: Partial<IOrderParticipation>) => api.post('/order-participations', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateOrderParticipation = () => {
  const request = (data: Partial<IOrderParticipation>) => api.put(`/order-participations/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteOrderParticipation = () => {
  const request = (id: string) => api.delete(`/order-participations/${id}`).then(res => res.data.data);
  return useMutation(request);
};
