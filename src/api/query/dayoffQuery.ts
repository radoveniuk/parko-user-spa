import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IUser } from 'interfaces/users.interface';

type Response = IDayOff & { user:IUser };

export const useGetDaysoff = (params: Partial<IDayOff> = {}, options: AnyObject = {}) => {
  const request = (): Promise<Response[]> => api.get('/days-off', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params,
  }).then(res => res.data.data);
  return useQuery<Response[]>(
    ['daysoff', JSON.stringify(params)], request, { initialData: [], ...options },
  );
};
