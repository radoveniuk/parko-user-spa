import { useMutation } from 'react-query';

import api from 'api/common';
import { IPrepayment } from 'interfaces/prepayment.interface';

export const useCreatePrepaymentMutation = () => {
  const request = (data: Partial<IPrepayment>) => api.post('/prepayments', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdatePrepaymentMutation = () => {
  const request = (data: Partial<IPrepayment> & {_id: string}) => api.put(`/prepayments/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeletePrepaymentMutation = () => {
  const request = (id: string) => api.delete(`/prepayments/${id}`).then(res => res.data.data);
  return useMutation(request);
};
