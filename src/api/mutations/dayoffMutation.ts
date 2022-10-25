import { useMutation } from 'react-query';

import api from 'api/common';
import { IDayOff } from 'interfaces/dayoff.interface';

export const useCreateDayoffMutation = () => {
  const request = (data: Partial<IDayOff>) => api.post('/days-off', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateDayoffMutation = () => {
  const request = (data: Partial<IDayOff>) => api.put(`/days-off/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};
