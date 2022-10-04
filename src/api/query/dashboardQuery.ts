import { useQuery } from 'react-query';

import api from 'api/common';
import { QueryOptions } from 'interfaces/query.types';

export const useGetDashboardData = (options: QueryOptions = {}) => {
  const request = (): Promise<Record<string, number>> => api.get('/dashboard').then(res => res.data.data);
  return useQuery('dashboardData', request, options);
};
