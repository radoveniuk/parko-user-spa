import api from 'api/common';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { useMutation } from 'react-query';

export const useCreatePrepaymentMutation = () => {
  const request = (data: Partial<IPrepayment>) => api.post('/prepayments', data).then(res => res.data.data);
  return useMutation(request);
};
