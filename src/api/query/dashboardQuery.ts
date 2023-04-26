import { useQuery } from 'react-query';
import { omit } from 'lodash-es';

import api from 'api/common';
import { QueryOptions } from 'interfaces/query.types';

export const useGetDashboardData = ({ exclude }: { exclude: string[] }, options: QueryOptions = {}) => {
  const request = (): Promise<Record<string, number>> => api.get('/dashboard').then(res => omit(res.data.data, exclude));
  return useQuery('dashboardData', request, options);
};
