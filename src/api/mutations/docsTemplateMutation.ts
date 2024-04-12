import { useMutation } from 'react-query';

import api, { saveFile } from 'api/common';
import { AnyObject } from 'interfaces/base.types';
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

type DownloadTemplateSettings = {
  userId?: string[], templateId?: string[], employmentId?: string[], fileId?: string, fileData?: AnyObject, signatureDate?: string
};
export const useDownloadPrintedTemplate = () => {
  const request = (data: DownloadTemplateSettings) =>
    api.post('/docs-templates-print', data, { responseType: 'blob' }).then(res => res.data);
  const downloadMutation = useMutation(request);

  return async (options: DownloadTemplateSettings, singleFileName?: string) => {
    await downloadMutation.mutateAsync(options).then((res) => {
      if (singleFileName) {
        saveFile(res, singleFileName);
      } else {
        saveFile(res, 'docs.zip');
      }
    });
  };
};
