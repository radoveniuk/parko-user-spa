import { useQuery } from 'react-query';

import api from 'api/common';
import { useAuthData } from 'contexts/AuthContext';
import { AnyObject } from 'interfaces/base.types';
import { IProject } from 'interfaces/project.interface';
import { QueryOptions } from 'interfaces/query.types';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import { fakeData } from './fakeQuery';

const DENIED_ROLES: any = ['super-admin'];

export const useGetResidences = (params: AnyObject = {}, options?: QueryOptions) => {
  const { role } = useAuthData();
  const request = (): Promise<IResidence[]> => api.get('/residences', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery<IResidence[]>(
    ['residences', JSON.stringify(params)], !DENIED_ROLES.includes(role) ? request : fakeData, { initialData: [], ...options },
  );
};

export const useGetResidence = (id: string) => {
  const request = (): Promise<IResidence> => api.get(`/residences/${id}`).then(res => res.data.data);
  return useQuery(['residence', id], request, { enabled: !!id });
};

export const useGetResidenceFilterLists = () => {
  const { role } = useAuthData();
  const request = (): Promise<{users: IUser[], projects: IProject[]}> => api.get('/residences-filter-lists')
    .then(res => res.data.data);
  return useQuery(
    ['residence', 'filters'],
    !DENIED_ROLES.includes(role)
      ? request
      : () => new Promise<{users: IUser[], projects: IProject[]}>((resolve) => resolve({ users: [], projects: [] })),
  );
};
