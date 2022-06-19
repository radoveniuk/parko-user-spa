import api from 'api/common';
import { INotification } from 'interfaces/notification.interface';
import { useQuery } from 'react-query';

export const useGetNotifications = (params: Partial<INotification> = {}) => {
  const request = (): Promise<INotification[]> => api.get('/notifications', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params,
  }).then(res => res.data.data);
  return useQuery(['notifications', JSON.stringify(params)], request, { initialData: [] });
};
