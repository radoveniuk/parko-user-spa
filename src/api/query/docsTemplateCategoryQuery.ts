import { useQuery } from 'react-query';

import api from 'api/common';
import { IDocsTemplateCategory } from 'interfaces/docsTemplateCategory.interface';

export const useGetDocsTemplateCategories = (params: Partial<IDocsTemplateCategory> = {}) => {
  const request = (): Promise<IDocsTemplateCategory[]> => api.get('/docs-templates-category', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['docsTemplatesCategories', JSON.stringify(params)], request, { initialData: [] });
};

export const useGetDocsTemplateCategory = (id: string) => {
  const request = (): Promise<IDocsTemplateCategory> => api.get(`/docs-templates-categories/${id}`).then(res => res.data.data);
  return useQuery(['docsTemplateCategory', id], request, { enabled: !!id });
};
