import { useQuery, useQueryClient } from 'react-query';

import api from 'api/common';
import { useAuthData } from 'contexts/AuthContext';
import { getCookieValue } from 'helpers/cookies';
import { AnyObject } from 'interfaces/base.types';
import { IProject } from 'interfaces/project.interface';
import { QueryOptions } from 'interfaces/query.types';
import { IUser } from 'interfaces/users.interface';

import { useGetProjects } from './projectQuery';

const DENIED_ROLES: any = ['user', 'super-admin'];

export const getUserListByParams = (params: AnyObject): Promise<IUser[]> => api.get('/users', {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  params,
}).then(res => res.data.data);

const fakeData = () => new Promise<IUser[]>((resolve) => resolve([]));

export const useGetUser = (id: string, options?: QueryOptions) => {
  const token = getCookieValue('Authorization');
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
  const request = (): Promise<IUser> => api.get(`/users/${id}`).then(res => ({ ...res.data.data, password: null }) as IUser);
  return useQuery<IUser>(['user-data', id], request, { enabled: !!id, ...options });
};

export const useGetUserList = (params: AnyObject = {}, options?: QueryOptions) => {
  const { role } = useAuthData();
  return useQuery<IUser[]>(
    ['users', JSON.stringify(params)],
    !DENIED_ROLES.includes(role) ? () => getUserListByParams(params) : fakeData,
    {
      initialData: [],
      ...options,
    },
  );
};

export const useGetUserListByClient = (client: string, options?: QueryOptions) => {
  const queryClient = useQueryClient();
  const cachedProjects: IProject[] | undefined = queryClient.getQueryData(['projects', JSON.stringify({ client })]);
  const { data: projects = [] } = useGetProjects({ client }, { enabled: !cachedProjects });
  const projectIds = (cachedProjects || projects).map((item) => item._id);
  const { role } = useAuthData();

  return useQuery<IUser[]>(
    ['users', 'client', client],
    !DENIED_ROLES.includes(role) ? () => getUserListByParams({ project: projectIds }) : fakeData,
    {
      initialData: [],
      enabled: !!projectIds.length,
      ...options,
    },
  );
};

export const useGetUserListForFilter = (params: AnyObject = {}, options?: QueryOptions) => {
  const { role } = useAuthData();
  return useQuery<IUser[]>(
    ['users-filter', JSON.stringify(params)],
    !DENIED_ROLES.includes(role) ? () => api.get('/users-filter', { params }).then(res => res.data.data) : fakeData,
    {
      initialData: [],
      cacheTime: Infinity,
      ...options,
    },
  );
};
