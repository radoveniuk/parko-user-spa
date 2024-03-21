import { useMutation } from 'react-query';

import api from 'api/common';
import { ICustomForm, ICustomFormField, ICustomFormFieldSectionBinding, ICustomFormSection } from 'interfaces/form.interface';

const PATH = '/custom-form';

export const useCreateCustomFormFieldMutation = () => {
  const request = (data: ICustomFormField) => api.post(`${PATH}/fields`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useCreateCustomFormSectionMutation = () => {
  const request = (data: ICustomFormSection) => api.post(`${PATH}/sections`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useCreateCustomFormMutation = () => {
  const request = (data: ICustomForm) => api.post(`${PATH}/forms`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useCreateCustomFormFieldSectionBindingMutation = () => {
  const request = (data: ICustomFormFieldSectionBinding) => api.post(`${PATH}/bindings`, data).then(res => res.data.data);
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

export const useUpdateCustomFormMutation = () => {
  const request = (data: ICustomForm) => api.put(`${PATH}/forms/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateCustomFormFieldSectionBindingMutation = () => {
  const request = (data: ICustomFormFieldSectionBinding) => api.put(`${PATH}/bindings/${data._id}`, data).then(res => res.data.data);
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

export const useDeleteCustomFormMutation = () => {
  const request = (id: string) => api.delete(`${PATH}/forms/${id}`).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteCustomFormFieldSectionBindingMutation = () => {
  const request = (id: string) => api.delete(`${PATH}/bindings/${id}`).then(res => res.data.data);
  return useMutation(request);
};
