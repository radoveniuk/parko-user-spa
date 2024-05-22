import { useMutation } from 'react-query';

import api from 'api/common';
import { IPropertyMovement } from 'interfaces/propertyMovement.interface';

export const useCreatePropertyMovement = () => {
  const request = (data: Partial<IPropertyMovement>) => api.post('/property-movements', data).then(res => res.data.data as IPropertyMovement<true>);
  return useMutation(request);
};

export const useUpdatePropertyMovement = () => {
  const request = (data: Partial<IPropertyMovement>) => api.put(`/property-movements/${data._id}`, data)
    .then(res => res.data.data as IPropertyMovement<true>);
  return useMutation(request);
};

export const useDeletePropertyMovement = () => {
  const request = (id: string) => api.delete(`/property-movements/${id}`).then(res => res.data.data);
  return useMutation(request);
};
