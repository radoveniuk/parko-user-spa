import { useQuery, useQueryClient } from 'react-query';

import api from 'api/common';
import { getCookieValue } from 'helpers/cookies';
import { AnyObject } from 'interfaces/base.types';
import { IProject } from 'interfaces/project.interface';
import { QueryOptions } from 'interfaces/query.types';
import { IUser } from 'interfaces/users.interface';

import { useGetProjects } from './projectQuery';

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

export const useGetUserList = (params: AnyObject = {}, options?: QueryOptions) => useQuery<IUser[]>(
  ['users', JSON.stringify(params)],
  () => getUserListByParams(params),
  {
    initialData: [],
    ...options,
  },
);

export const useGetUserListByClient = (client: string, options?: QueryOptions) => {
  const queryClient = useQueryClient();
  const cachedProjects: IProject[] | undefined = queryClient.getQueryData(['projects', JSON.stringify({ client })]);
  const { data: projects = [] } = useGetProjects({ client }, { enabled: !cachedProjects });
  return useQuery<IUser[]>(
    ['users', 'client', client],
    () => getUserListByParams({ project: (cachedProjects || projects).map((item) => item._id) }),
    {
      initialData: [],
      ...options,
    },
  );
};

export const useGetUserListForFilter = (params: AnyObject = {}, options?: QueryOptions) => useQuery<IUser[]>(
  ['users-filter', JSON.stringify(params)],
  () => api.get('/users-filter', { params }).then(res => res.data.data),
  {
    initialData: [],
    cacheTime: Infinity,
    ...options,
  },
);
