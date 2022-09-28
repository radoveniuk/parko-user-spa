import { useMutation } from 'react-query';

import api from 'api/common';
import { IAccommodation } from 'interfaces/accommodation.interface';

export const useCreateAccommodation = () => {
  const request = (data: IAccommodation) => api.post('/accommodations', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateAccommodation = () => {
  const request = (data: IAccommodation) => api.put(`/accommodations/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteAccommodation = () => {
  const request = (id: string) => api.delete(`/accommodations/${id}`).then(res => res.data.data);
  return useMutation(request);
};
