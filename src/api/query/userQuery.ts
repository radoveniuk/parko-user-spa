import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IUser } from 'interfaces/users.interface';
import { QueryOptions } from 'interfaces/query.types';
import { getCookieValue } from 'helpers/cookies';

export const getUserListByParams = (params: AnyObject): Promise<IUser[]> => api.get('/users', {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  params,
}).then(res => res.data.data);

export const useGetUser = (id: string, options?: QueryOptions) => {
  const token = getCookieValue('Authorization');
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
  const request = (): Promise<IUser> => api.get(`/users/${id}`).then(res => ({ ...res.data.data, password: null }));
  return useQuery<IUser>(['user-data', id], request, { enabled: !!id, ...options });
};

export const useGetUserList = (params: AnyObject = {}, options?: QueryOptions) => useQuery<IUser[]>(['users',
  JSON.stringify(options)], () => getUserListByParams(params), {
  initialData: [],
  refetchOnWindowFocus: false,
  ...options,
});
