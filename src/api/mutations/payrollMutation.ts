import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { omit } from 'lodash-es';
import { useSnackbar } from 'notistack';

import api from 'api/common';
import { IPaycheck } from 'interfaces/paycheck.interface';

export const useCreatePayrollMutation = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const request = (data: Partial<IPaycheck>) => api.post('/payrolls', data).then((res) => res.data.data);
  return useMutation(request, {
    onSuccess: () => void enqueueSnackbar(t('paycheck.successfullUpload'), { variant: 'success' }),
  });
};

export const useDeletePayrollMutation = () => {
  const request = (id: string) => api.delete(`/payrolls/${id}`);
  return useMutation(request);
};

export const useUpdatePayrollMutation = () => {
  const request = (data: Partial<IPaycheck>) => api.put(`/payrolls/${data._id}`, omit(data, '_id'));
  return useMutation(request);
};
