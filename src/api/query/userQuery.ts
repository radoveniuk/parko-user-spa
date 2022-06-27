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

export const useGetUser = (id: string, options?: QueryOptions) => {
  const request = (): Promise<IUser> => api.get(`/users/${id}`).then(res => ({ ...res.data.data, password: null }));
  return useQuery(['user-data', id], request, { enabled: !!id, ...options });
};

export const useGetUserList = (params: AnyObject = {}, options?: QueryOptions) => useQuery<IUser[]>(['users',
  JSON.stringify(options)], () => getUserListByParams(params), {
  initialData: [],
  refetchOnWindowFocus: false,
  ...options,
});
