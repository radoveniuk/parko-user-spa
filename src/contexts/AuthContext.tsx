import React, {
  createContext, ReactNode, useCallback, useContext, useEffect, useState,
} from 'react';
import { useLoginMutation } from 'api/mutations/userMutation';
import { LoginDto } from 'interfaces/users.interface';

type contextType = {
  isAuth: boolean;
  login(data: LoginDto): Promise<boolean>
};

const AuthContext = createContext<contextType | undefined>(undefined);
AuthContext.displayName = 'AuthContext';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(true);
  const loginMutation = useLoginMutation();

  const login = async (data: LoginDto) => {
    const loginResult = await loginMutation.mutateAsync(data);
    if (loginResult) {
      setIsAuth(true);
      return true;
    }
    return false;
  };

  const checkAuth = useCallback(() => {
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isAuth, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): boolean => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('Auth provider not exist');
  }
  return authContext.isAuth;
};

export const useLogin = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('Auth provider not exist');
  }
  return authContext.login;
};

export default AuthProvider;
