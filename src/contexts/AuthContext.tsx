import React, {
  createContext, ReactNode, useCallback, useContext, useState,
} from 'react';

import { useLoginMutation, useLogoutMutation } from 'api/mutations/userMutation';
import { useGetUser } from 'api/query/userQuery';
import { eraseCookie, getCookieValue } from 'helpers/cookies';
import useLocalStorageState from 'hooks/useLocalStorageState';
import { IRole } from 'interfaces/role.interface';
import { LoginDto } from 'interfaces/users.interface';

type contextType = {
  isAuth: boolean;
  login(data: LoginDto): Promise<boolean>;
  logout(): void;
  userId: string;
  isFetching: boolean;
  username: string;
  permissions: string[];
};

const AuthContext = createContext<contextType | undefined>(undefined);
AuthContext.displayName = 'AuthContext';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(!!getCookieValue('Authorization'));
  const [userId, setUserId] = useLocalStorageState('userId');
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const { data: userData, isLoading } = useGetUser(userId, { enabled: !!userId && isAuth });

  const login = async (data: LoginDto) => {
    const loginResult = await loginMutation.mutateAsync(data);
    if (loginResult) {
      setIsAuth(true);
      setUserId(loginResult._id);
      return true;
    }
    return false;
  };

  const logout = useCallback(() => {
    if (userData) {
      logoutMutation.mutateAsync(userData).then(() => {
        eraseCookie('Authorization');
      });
    }
    setIsAuth(false);
    setUserId('');
  }, [logoutMutation, setUserId, userData]);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        login,
        logout,
        userId,
        username: userData?.fullname as string,
        isFetching: isLoading,
        permissions: [...new Set(userData?.roles?.flatMap(role => (role as unknown as IRole).permissions))],
      }}>
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

export const useLogout = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('Auth provider not exist');
  }
  return authContext.logout;
};

export const useAuthData = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('Auth provider not exist');
  }

  return {
    id: authContext.userId,
    username: authContext.username,
    isFetching: authContext.isFetching,
    permissions: authContext.permissions,
  };
};

export default AuthProvider;
