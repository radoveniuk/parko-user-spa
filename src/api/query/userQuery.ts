import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IUser } from 'interfaces/users.interface';
import { QueryOptions } from 'interfaces/query.types';

export const getUserListByParams = (params: AnyObject): Promise<IUser[]> => api.get('/users', {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  params,
}).then(res => res.data.data);

export const useGetUser = (id: string) => {
  const request = (): Promise<IUser> => api.get(`/users/${id}`).then(res => ({ ...res.data.data, password: null }));
  return useQuery(['user-data', id], request);
};

export const useGetUserList = (params: AnyObject = {}, options?: QueryOptions) => useQuery<IUser[]>('users', () => getUserListByParams(params),
  {
    initialData: [],
    refetchOnWindowFocus: false,
    ...options,
  });
