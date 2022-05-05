import api from 'api/common';
import { IDayOff } from 'interfaces/dayoff.interface';
import { useQuery } from 'react-query';

export const useGetDaysoff = (params: Partial<IDayOff> = {}) => {
  const request = (): Promise<IDayOff[]> => api.get('/days-off', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params,
  }).then(res => res.data.data);
  return useQuery('daysoff', request, { initialData: [] });
};
