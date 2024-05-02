import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IRole } from 'interfaces/role.interface';

export const useGetRoles = (params: Partial<IRole> = {}, queryOptions: AnyObject = {}) => {
  const request = (): Promise<IRole[]> => api.get('/roles', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['roles', JSON.stringify(params)], request, { initialData: [], ...queryOptions });
};

export const useGetRole = (id: string) => {
  const request = (): Promise<IRole> => api.get(`/roles/${id}`).then(res => res.data.data);
  return useQuery(['role', id], request, { enabled: !!id });
};

export const useGetSystemPermissions = () => {
  const request = (): Promise<string[]> => api.get('/roles/permissions').then(res => res.data.data);
  return useQuery(['permissions'], request);
};
