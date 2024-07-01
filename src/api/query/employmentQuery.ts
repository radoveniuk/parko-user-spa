import { useQuery } from 'react-query';

import api from 'api/common';
import { IEmployment } from 'interfaces/employment.interface';

export const useGetEmployments = (params: Partial<IEmployment> = {}) => {
  const request = (): Promise<IEmployment[]> => api.get('/employments', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['employments', JSON.stringify(params)], request, { staleTime: 300_000 });
};
