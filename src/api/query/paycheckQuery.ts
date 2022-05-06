import api from 'api/common';
import { IPaycheck } from 'interfaces/paycheck.interface';
import { useQuery } from 'react-query';

export const useGetPaycheckList = (params: Partial<IPaycheck> = {}) => {
  const request = (): Promise<IPaycheck[]> => api.get('/paychecks', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params,
  }).then(res => res.data.data);
  return useQuery('paychecks', request, { initialData: [] });
};
