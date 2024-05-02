import { useMutation } from 'react-query';

import api from 'api/common';
import { IRole } from 'interfaces/role.interface';

export const useCreateRole = () => {
  const request = (data: Partial<IRole>) => api.post('/roles', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateRole = () => {
  const request = (data: Partial<IRole>) => api.put(`/roles/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteRole = () => {
  const request = (id: string) => api.delete(`/roles/${id}`).then(res => res.data.data);
  return useMutation(request);
};
