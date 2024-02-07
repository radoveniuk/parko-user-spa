import { useMutation } from 'react-query';

import api from 'api/common';
import { IClient } from 'interfaces/client.interface';

export const useCreateClientMutation = () => {
  const request = (data: Partial<IClient>) => api.post('/clients', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateClientMutation = () => {
  const request = (data: Partial<IClient> & { _id: string }) => api.put(`/clients/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteClientMutation = () => {
  const request = (id: string) => api.delete(`/clients/${id}`).then(res => res.data.data);
  return useMutation(request);
};
