import { useMutation } from 'react-query';

import api from 'api/common';
import { IProperty } from 'interfaces/property.interface';

export const useCreateProperty = () => {
  const request = (data: Partial<IProperty>) => api.post('/properties', data).then(res => res.data.data as IProperty<true>);
  return useMutation(request);
};

export const useUpdateProperty = () => {
  const request = (data: Partial<IProperty>) => api.put(`/properties/${data._id}`, data).then(res => res.data.data as IProperty<true>);
  return useMutation(request);
};

export const useDeleteProperty = () => {
  const request = (id: string) => api.delete(`/properties/${id}`).then(res => res.data.data);
  return useMutation(request);
};
