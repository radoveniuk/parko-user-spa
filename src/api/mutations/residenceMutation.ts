import { useMutation } from 'react-query';

import api from 'api/common';
import { IResidence } from 'interfaces/residence.interface';

export const useCreateResidence = () => {
  const request = (data: IResidence) => api.post('/residences', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateResidence = () => {
  const request = (data: IResidence) => api.put(`/residences/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteResidence = () => {
  const request = (id: string) => api.delete(`/residences/${id}`).then(res => res.data.data);
  return useMutation(request);
};
