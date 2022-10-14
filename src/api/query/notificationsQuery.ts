import { useQuery } from 'react-query';

import api from 'api/common';
import { INotification } from 'interfaces/notification.interface';
import { QueryOptions } from 'interfaces/query.types';

export const useGetNotifications = (params: Partial<INotification> = {}, options: QueryOptions = {}) => {
  const request = (): Promise<INotification[]> => api.get('/notifications', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params,
  }).then(res => res.data.data);
  return useQuery<INotification[]>(['notifications', JSON.stringify(params)], request, { initialData: [], ...options });
};
