import { useQuery } from 'react-query';

import api from 'api/common';
import { useAuthData } from 'contexts/AuthContext';
import { IPaycheck } from 'interfaces/paycheck.interface';
import { UserRole } from 'interfaces/users.interface';

const DENIED_ROLES: (UserRole | undefined)[] = ['super-admin'];

const fakeData = () => new Promise<IPaycheck[]>((resolve) => resolve([]));

export const useGetPayrollList = (params: Partial<IPaycheck> = {}) => {
  const { role } = useAuthData();
  const request = (): Promise<IPaycheck[]> => api.get('/payrolls', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params,
  }).then(res => res.data.data);
  return useQuery(['payrolls', JSON.stringify(params)], !DENIED_ROLES.includes(role) ? request : fakeData, { initialData: [] });
};
