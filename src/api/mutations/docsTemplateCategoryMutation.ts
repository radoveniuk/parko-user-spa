import { useMutation } from 'react-query';

import api from 'api/common';
import { IDocsTemplateCategory } from 'interfaces/docsTemplateCategory.interface';

export const useCreateDocsTemplate = () => {
  const request = (data: IDocsTemplateCategory) => api.post('/docs-template-categories', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateDocsTemplate = () => {
  const request = (data: IDocsTemplateCategory) => api.put(`/docs-template-categories/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteDocsTemplate = () => {
  const request = (id: string) => api.delete(`/docs-template-categories/${id}`).then(res => res.data.data);
  return useMutation(request);
};
