import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useSnackbar } from 'notistack';

import api from 'api/common';
import { IDayOff } from 'interfaces/dayoff.interface';

export const useCreateDayoffMutation = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const request = (data: Partial<IDayOff>) => api.post('/days-off', data).then(res => res.data.data);
  return useMutation(request, { onSuccess: () => void enqueueSnackbar(t('dayoffPage.form.successCreate'), { variant: 'success' }) });
};

export const useUpdateDayoffMutation = () => {
  const request = (data: Partial<IDayOff>) => api.put(`/days-off/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteDayoffMutation = () => {
  const request = (id: string) => api.delete(`/days-off/${id}`).then(res => res.data.data);
  return useMutation(request);
};
