import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IPrepayment } from 'interfaces/prepayment.interface';

export const useGetPrepayments = (params: AnyObject = {}) => {
  const request = (): Promise<IPrepayment[]> => api.get('/prepayments', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['prepayments', JSON.stringify(params)], request, { initialData: [] });
};
