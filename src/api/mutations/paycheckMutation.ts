import api from 'api/common';
import { IPaycheck } from 'interfaces/paycheck.interface';
import { useMutation } from 'react-query';

export const useCreatePaychecksMutation = () => {
  const request = (data: Partial<IPaycheck>[]) => Promise.all(data.map((paycheck) => api.post('/paychecks', paycheck)));
  return useMutation(request);
};
