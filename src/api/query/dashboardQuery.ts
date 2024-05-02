import { useQuery } from 'react-query';
import { omit } from 'lodash-es';

import api from 'api/common';
import { QueryOptions } from 'interfaces/query.types';

export const useGetDashboardData = (options: QueryOptions = {}) => {
  const request = (): Promise<Record<string, number>> => api.get('/dashboard-v2').then(res => omit(res.data.data));
  return useQuery('dashboardData', request, options);
};
