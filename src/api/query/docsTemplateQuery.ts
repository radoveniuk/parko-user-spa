import { useQuery } from 'react-query';

import api from 'api/common';
import { IDocsTemplate } from 'interfaces/docsTemplate.interface';
import { IFile } from 'interfaces/file.interface';

export const useGetDocsTemplates = (params: Partial<IDocsTemplate> = {}) => {
  const request = (): Promise<(IDocsTemplate & { file: IFile })[]> => api.get('/docs-templates', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['docsTemplates', JSON.stringify(params)], request, { initialData: [] });
};

export const useGetDocsTemplate = (id: string) => {
  const request = (): Promise<IDocsTemplate> => api.get(`/docs-templates/${id}`).then(res => res.data.data);
  return useQuery(['docsTemplate', id], request, { enabled: !!id });
};
