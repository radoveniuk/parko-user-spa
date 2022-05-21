import api from 'api/common';
import { IUser } from 'interfaces/users.interface';
import { useQuery } from 'react-query';

export const useGetUser = (id: string) => {
  const request = (): Promise<IUser> => api.get(`/users/${id}`).then(res => ({ ...res.data.data, password: null }));
  return useQuery(['user-data', id], request);
};

export const useGetUserList = (params: Partial<IUser>) => {
  const request = (): Promise<IUser[]> => api.get('/users', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params,
  }).then(res => res.data.data);
  return useQuery('users', request, { initialData: [] });
};
