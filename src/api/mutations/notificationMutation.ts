import { useMutation } from 'react-query';

import api from 'api/common';
import { INotification } from 'interfaces/notification.interface';

export const useCreateNotificationMutation = () => {
  const request = (data: Partial<INotification>) => api.post('/notifications', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateNotificationMutation = () => {
  const request = (data: Partial<INotification>) => api.put(`/notifications/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};
