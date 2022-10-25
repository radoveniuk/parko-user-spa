import { useQuery } from 'react-query';

import api from 'api/common';
import { IFile } from 'interfaces/file.interface';
import { QueryOptions } from 'interfaces/query.types';

export const useGetFiles = (ids: string[], options?: QueryOptions) => {
  const request = (): Promise<IFile[]> => api.get('/files', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: { _id: ids },
  }).then(res => res.data.data);
  return useQuery<IFile[]>(['files', ...ids], request, options);
};
