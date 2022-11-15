import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useSnackbar } from 'notistack';

import api from 'api/common';
import { setCookie } from 'helpers/cookies';
import { IUser, LoginDto, RegisterUserDto } from 'interfaces/users.interface';

export const useLoginMutation = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const loginRequest = (data: LoginDto): Promise<IUser> => api.post('/login', data).then(res => {
    const { token, expiresIn } = res.data.data.token;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setCookie('Authorization', token, expiresIn);
    return res.data.data.findUser;
  });
  return useMutation(loginRequest, {
    onError: () => void enqueueSnackbar(t('user.wrongCredentials'), { variant: 'error' }),
    onSuccess: undefined,
  });
};

export const useLogoutMutation = () => {
  const request = (data: IUser) => api.post('/logout', data).then(res => res.data.data);
  return useMutation(request, {
    onSuccess: undefined,
  });
};

export const useRegisterMutation = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const registerRequest = (data: RegisterUserDto) => api.post('/signup', data).then(res => res.data.data);
  return useMutation(registerRequest, {
    onSuccess: () => void enqueueSnackbar(t('user.successfullRegister'), { variant: 'success' }),
    onError: () => void enqueueSnackbar(t('user.failedRegister'), { variant: 'error' }),
  });
};

export const useCreateUserMutation = () => {
  const request = (data: Partial<IUser>) => api.post('/users', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateUserMutation = () => {
  const request = (data: Partial<IUser> & { _id: string }) => api.put(`/users/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteUserMutation = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const request = (data: Partial<IUser> & { _id: string }) => api.delete(`/users/${data._id}`).then(res => res.data.data);
  return useMutation(request, {
    onSuccess: () => void enqueueSnackbar(t('user.removedSuccess'), { variant: 'success' }),
  });
};

export const useUploadUsersMutation = () => {
  const request = (data: Partial<IUser>[]) => api.post('/users/upload', data).then(res => res.data.data);
  return useMutation(request);
};
