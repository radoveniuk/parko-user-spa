import { useMutation } from 'react-query';

import api from 'api/common';
import { INotification } from 'interfaces/notification.interface';

export const useCreateNotificationMutation = () => {
  const request = (data: Partial<INotification>) => api.post('/notifications', data).then(res => res.data.data);
  return useMutation(request, { onSuccess: undefined });
};

export const useUpdateNotificationMutation = () => {
  const request = (data: Partial<INotification>) => api.put(`/notifications/${data._id}`, data).then(res => res.data.data);
  return useMutation(request, { onSuccess: undefined });
};

export const useDeleteNotificationMutation = () => {
  const request = (id: string) => api.delete(`/notifications/${id}`).then(res => res.data.data);
  return useMutation(request, { onSuccess: undefined });
};
