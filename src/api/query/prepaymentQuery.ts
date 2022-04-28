import api from 'api/common';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { useQuery } from 'react-query';

export const useGetPrepayments = (params: Partial<IPrepayment> = {}) => {
  const request = (): Promise<IPrepayment[]> => api.get('/prepayments', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params,
  }).then(res => res.data.data);
  return useQuery('prepayments', request, { initialData: [] });
};
