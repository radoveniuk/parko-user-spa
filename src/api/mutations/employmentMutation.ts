import { useMutation } from 'react-query';

import api from 'api/common';
import { IEmployment } from 'interfaces/employment.interface';

export const useCreateEmployment = () => {
  const request = (data: Partial<IEmployment>) => api.post('/employments', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateEmployment = () => {
  const request = (data: IEmployment) => api.put(`/employments/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteEmployment = () => {
  const request = (id: string) => api.delete(`/employments/${id}`).then(res => res.data.data);
  return useMutation(request);
};
