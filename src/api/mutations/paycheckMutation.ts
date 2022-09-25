import { useMutation } from 'react-query';

import api from 'api/common';
import { IPaycheck } from 'interfaces/paycheck.interface';

export const useCreatePaychecksMutation = () => {
  const request = (data: Partial<IPaycheck>[]) => Promise.all(data.map((paycheck) => api.post('/paychecks', paycheck)));
  return useMutation(request);
};

export const useDeletePaycheckMutation = () => {
  const request = (id: string) => api.delete(`/paychecks/${id}`);
  return useMutation(request);
};
