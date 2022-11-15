import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useSnackbar } from 'notistack';

import api from 'api/common';
import { IPrepayment } from 'interfaces/prepayment.interface';

export const useCreatePrepaymentMutation = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const request = (data: Partial<IPrepayment>) => api.post('/prepayments', data).then(res => res.data.data);
  return useMutation(request, {
    onSuccess: () => void enqueueSnackbar(t('prepaymentPage.form.successCreate'), { variant: 'success' }),
  });
};

export const useUpdatePrepaymentMutation = () => {
  const request = (data: Partial<IPrepayment> & {_id: string}) => api.put(`/prepayments/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeletePrepaymentMutation = () => {
  const request = (id: string) => api.delete(`/prepayments/${id}`).then(res => res.data.data);
  return useMutation(request);
};
