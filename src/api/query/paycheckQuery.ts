import { useQuery } from 'react-query';

import api from 'api/common';
import { useAuthData } from 'contexts/AuthContext';
import { IPaycheck } from 'interfaces/paycheck.interface';

const DENIED_ROLES: any = ['super-admin'];

const fakeData = () => new Promise<IPaycheck[]>((resolve) => resolve([]));

export const useGetPaycheckList = (params: Partial<IPaycheck> = {}) => {
  const { role } = useAuthData();
  const request = (): Promise<IPaycheck[]> => api.get('/paychecks', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params,
  }).then(res => res.data.data);
  return useQuery(['paychecks', JSON.stringify(params)], !DENIED_ROLES.includes(role) ? request : fakeData, { initialData: [] });
};
