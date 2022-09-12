import { useMutation } from 'react-query';

import api from 'api/common';
import { ICustomFormField, ICustomFormSection } from 'interfaces/form.interface';

const PATH = '/custom-form';

export const useCreateCustomFormFieldMutation = () => {
  const request = (data: ICustomFormField) => api.post(`${PATH}/fields`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useCreateCustomFormSectionMutation = () => {
  const request = (data: ICustomFormSection) => api.post(`${PATH}/sections`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateCustomFormFieldMutation = () => {
  const request = (data: ICustomFormField) => api.put(`${PATH}/fields/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateCustomFormSectionMutation = () => {
  const request = (data: ICustomFormSection) => api.put(`${PATH}/sections/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteCustomFormFieldMutation = () => {
  const request = (id: string) => api.delete(`${PATH}/fields/${id}`).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteCustomFormSectionMutation = () => {
  const request = (id: string) => api.delete(`${PATH}/sections/${id}`).then(res => res.data.data);
  return useMutation(request);
};
