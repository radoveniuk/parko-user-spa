import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { omit } from 'lodash-es';
import { useSnackbar } from 'notistack';

import api from 'api/common';
import { IPaycheck } from 'interfaces/paycheck.interface';

export const useCreatePaychecksMutation = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const request = (data: Partial<IPaycheck>[]) => Promise.all(data.map((paycheck) => api.post('/paychecks', paycheck)));
  return useMutation(request, {
    onSuccess: () => void enqueueSnackbar(t('paycheck.successfullUpload'), { variant: 'success' }),
  });
};

export const useDeletePaycheckMutation = () => {
  const request = (id: string) => api.delete(`/paychecks/${id}`);
  return useMutation(request);
};

export const useUpdatePaycheckMutation = () => {
  const request = (data: Partial<IPaycheck>) => api.put(`/paychecks/${data._id}`, omit(data, '_id'));
  return useMutation(request);
};
