import { useMutation } from 'react-query';

import api, { saveFile } from 'api/common';
import { IDocsTemplate } from 'interfaces/docsTemplate.interface';

export const useCreateDocsTemplate = () => {
  const request = (data: IDocsTemplate) => api.post('/docs-templates', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateDocsTemplate = () => {
  const request = (data: IDocsTemplate) => api.put(`/docs-templates/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteDocsTemplate = () => {
  const request = (id: string) => api.delete(`/docs-templates/${id}`).then(res => res.data.data);
  return useMutation(request);
};

export const useDownloadPrintedTemplate = () => {
  const request = (data: { userId: string[], templateId: string }) =>
    api.post('/docs-templates-print', data, { responseType: 'blob' }).then(res => res.data);
  const downloadMutation = useMutation(request);

  return (userId: string[], templateId: string) => {
    downloadMutation.mutateAsync({ userId, templateId }).then((res) => {
      saveFile(res, 'docs.zip');
    });
  };
};
