import api from 'api/common';
import { IDayOff } from 'interfaces/dayoff.interface';
import { useMutation } from 'react-query';

export const useCreateDayoffMutation = () => {
  const request = (data: Partial<IDayOff>) => api.post('/days-off', data).then(res => res.data.data);
  return useMutation(request);
};
