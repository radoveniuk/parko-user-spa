import api from 'api/common';
import { IUser, LoginDto, RegisterUserDto } from 'interfaces/users.interface';
import { useMutation } from 'react-query';

export const useLoginMutation = () => {
  const loginRequest = (data: LoginDto): Promise<IUser> => api.post('/login', data).then(res => res.data.data);
  return useMutation(loginRequest);
};

export const useRegister = () => {
  const registerRequest = (data: RegisterUserDto) => api.post('/signup', data).then(res => res.data.data);
  return useMutation(registerRequest);
};
