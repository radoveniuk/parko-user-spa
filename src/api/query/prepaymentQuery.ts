import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IUser } from 'interfaces/users.interface';

export const useGetPrepayments = (params: AnyObject = {}, options: AnyObject = {}) => {
  const request = (): Promise<(IPrepayment & { user: IUser })[]> => api.get('/prepayments', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['prepayments', JSON.stringify(params)], request, { initialData: [], ...options });
};
