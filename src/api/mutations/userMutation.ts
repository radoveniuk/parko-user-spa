import api from 'api/common';
import { IUser, LoginDto, RegisterUserDto } from 'interfaces/users.interface';
import { useMutation } from 'react-query';

export const useLoginMutation = () => {
  const loginRequest = (data: LoginDto): Promise<IUser> => api.post('/login', data).then(res => res.data.data);
  return useMutation(loginRequest);
};

export const useLogoutMutation = () => {
  const request = (data: IUser) => api.post('/logout', data).then(res => res.data.data);
  return useMutation(request);
};

export const useRegisterMutation = () => {
  const registerRequest = (data: RegisterUserDto) => api.post('/signup', data).then(res => res.data.data);
  return useMutation(registerRequest);
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
  const request = (data: Partial<IUser> & { _id: string }) => api.delete(`/users/${data._id}`).then(res => res.data.data);
  return useMutation(request);
};

export const useUploadUsersMutation = () => {
  const request = (data: Partial<IUser>[]) => api.post('/users/upload', data).then(res => res.data.data);
  return useMutation(request);
};
