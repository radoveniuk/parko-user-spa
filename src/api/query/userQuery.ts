import api from 'api/common';
import { IUser } from 'interfaces/users.interface';
import { useQuery } from 'react-query';

export const useGetUser = (id: string) => {
  const request = (): Promise<IUser> => api.get(`/users/${id}`).then(res => ({ ...res.data.data, password: null }));
  return useQuery('user-data', request);
};
