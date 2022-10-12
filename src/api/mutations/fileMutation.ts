import { useMutation } from 'react-query';

import api from 'api/common';
import { IFile } from 'interfaces/file.interface';

export const useDeleteFileMutation = () => {
  const request = (data: IFile) => api.delete('/files', { data }).then(res => res.data.data);
  return useMutation(request);
};
