import { useQuery } from 'react-query';

import api from 'api/common';
import { IPaycheck } from 'interfaces/paycheck.interface';

export const useGetPaycheckList = (params: Partial<IPaycheck> = {}) => {
  const request = (): Promise<IPaycheck[]> => api.get('/paychecks', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params,
  }).then(res => res.data.data);
  return useQuery(['paychecks', JSON.stringify(params)], request, { initialData: [] });
};
