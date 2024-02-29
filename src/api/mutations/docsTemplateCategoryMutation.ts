import { useMutation } from 'react-query';

import api from 'api/common';
import { IDocsTemplateCategory } from 'interfaces/docsTemplateCategory.interface';

export const useCreateDocsTemplateCategory = () => {
  const request = (data: IDocsTemplateCategory) => api.post('/docs-template-categories', data).then(res => res.data.data);
  return useMutation(request, { onSuccess: () => undefined });
};

export const useUpdateDocsTemplateCategory = () => {
  const request = (data: IDocsTemplateCategory) => api.put(`/docs-template-categories/${data._id}`, data).then(res => res.data.data);
  return useMutation(request, { onSuccess: () => undefined });
};

export const useDeleteDocsTemplateCategory = () => {
  const request = (id: string) => api.delete(`/docs-template-categories/${id}`).then(res => res.data.data);
  return useMutation(request, { onSuccess: () => undefined });
};
