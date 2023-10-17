import { useQuery } from 'react-query';

import api from 'api/common';
import { useAuthData } from 'contexts/AuthContext';
import { IDayOff } from 'interfaces/dayoff.interface';

const DENIED_ROLES: any = ['super-admin'];

const fakeData = () => new Promise<IDayOff[]>((resolve) => resolve([]));

export const useGetDaysoff = (params: Partial<IDayOff> = {}) => {
  const { role } = useAuthData();
  const request = (): Promise<IDayOff[]> => api.get('/days-off', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params,
  }).then(res => res.data.data);
  return useQuery(['daysoff', JSON.stringify(params)], !DENIED_ROLES.includes(role) ? request : fakeData, { initialData: [] });
};
