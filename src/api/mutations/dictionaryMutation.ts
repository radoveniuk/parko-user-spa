import { useMutation } from 'react-query';

import api from 'api/common';
import { IDictionary } from 'interfaces/dictionary.interface';

export const useCreateDictionaryMutation = () => {
  const request = (data: Partial<IDictionary>) => api.post('/dictionaries', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateDictionaryMutation = () => {
  const request = (data: Partial<IDictionary>) => api.put(`/dictionaries/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteDictionaryMutation = () => {
  const request = (id: string) => api.delete(`/dictionaries/${id}`).then(res => res.data.data);
  return useMutation(request);
};
