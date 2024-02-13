import { useQuery } from 'react-query';

import api from 'api/common';
import { useAuthData } from 'contexts/AuthContext';
import { AnyObject } from 'interfaces/base.types';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IUser } from 'interfaces/users.interface';

const DENIED_ROLES: any = ['super-admin'];

type Response = IDayOff & { user:IUser };

const fakeData = () => new Promise<Response[]>((resolve) => resolve([]));

export const useGetDaysoff = (params: Partial<IDayOff> = {}, options: AnyObject = {}) => {
  const { role } = useAuthData();
  const request = (): Promise<Response[]> => api.get('/days-off', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params,
  }).then(res => res.data.data);
  return useQuery<Response[]>(
    ['daysoff', JSON.stringify(params)], !DENIED_ROLES.includes(role) ? request : fakeData, { initialData: [], ...options },
  );
};
