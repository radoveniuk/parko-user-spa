import { useState } from 'react';
import { useQuery } from 'react-query';

import api from 'api/common';
import { getCookieValue } from 'helpers/cookies';
import { AnyObject } from 'interfaces/base.types';
import { QueryOptions } from 'interfaces/query.types';
import { IUser } from 'interfaces/users.interface';

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
  const request = (): Promise<IUser | undefined> => api.get(`/users/${id}`)
    .then(res => ({ ...res.data.data, password: null }) as IUser)
    .catch(() => {
      window.location.href = '/not-found';
      return undefined;
    });
  return useQuery<IUser | undefined>(['user-data', id], request, { enabled: !!id, ...options });
};

export const useGetUserList = (params: AnyObject = {}, options?: QueryOptions) => {
  const [isFirstTimeFetched, setIsFirstTimeFetched] = useState(false);
  const { data, isFetching, ...rest } = useQuery<IUser[]>(
    ['users', JSON.stringify(params)],
    () => getUserListByParams(params),
    {
      staleTime: 300000,
      onSuccess () {
        setIsFirstTimeFetched(true);
      },
      ...options,
    },
  );

  return { data, isFetching, isFirstTimeFetched, ...rest };
};

export const useGetUserListForFilter = (params: AnyObject = {}, options?: QueryOptions) =>
  useQuery<Pick<IUser, '_id' | 'fullname' | 'roles' | 'status' | 'project'>[]>(
    ['users-filter', JSON.stringify(params)],
    () => api.get('/users-filter', { params }).then(res => res.data.data),
    {
      staleTime: 300000,
      ...options,
    },
  );

type UserDetiledFilterOption = {
  value: string;
  label?: string;
  count?: number;
};

type UserDetiledFilters =
Record<'statuses'|'projects'|'clients'|'employmentProjectTypes'|'workTypes'|'recruiters'|'sexes'|'countries', UserDetiledFilterOption[]>

export const useGetUsersDetailedFilters = (params: AnyObject = {}, options?: QueryOptions) =>
  useQuery<UserDetiledFilters>(
    ['users-detailed-filters', JSON.stringify(params)],
    () => api.get('/users-detailed-filters', { params }).then(res => res.data.data),
    {
      staleTime: 300000,
      ...options,
    },
  );
