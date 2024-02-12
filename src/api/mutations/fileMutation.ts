import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useSnackbar } from 'notistack';

import api from 'api/common';
import { IFile } from 'interfaces/file.interface';

export const useUpdateFileMutation = () => {
  const request = (data: IFile) => api.put(`/files/${data._id}`, { data }).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteFileMutation = () => {
  const request = (data: IFile) => api.delete('/files', { data }).then(res => res.data.data);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  return useMutation(request, {
    onSuccess () {
      enqueueSnackbar(t('fileDeletedSuccess'), { variant: 'info' });
    },
  });
};
