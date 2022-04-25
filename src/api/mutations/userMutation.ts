import api from 'api/common';
import { LoginDto } from 'interfaces/users.interface';
import { useMutation } from 'react-query';

export const useLogin = () => {
  const mutation = useMutation((data: LoginDto) => api.post('/login', data).then(res => res.data.data));
  return mutation;
};
