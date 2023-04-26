import React, {
  createContext, ReactNode, useCallback, useContext, useMemo, useState,
} from 'react';

import { useLoginMutation, useLogoutMutation } from 'api/mutations/userMutation';
import { useGetUser } from 'api/query/userQuery';
import { eraseCookie, getCookieValue } from 'helpers/cookies';
import useLocalStorageState from 'hooks/useLocalStorageState';
import { LoginDto, UserRole } from 'interfaces/users.interface';

type contextType = {
  isAuth: boolean;
  login(data: LoginDto): Promise<boolean>;
  logout(): void;
  userId: string;
  role: UserRole | undefined;
  isVerified: boolean;
  username: string;
};

const AuthContext = createContext<contextType | undefined>(undefined);
AuthContext.displayName = 'AuthContext';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(!!getCookieValue('Authorization'));
  const [userId, setUserId] = useLocalStorageState('userId');
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const { data: userData } = useGetUser(userId, { enabled: !!userId && isAuth });

  const isVerified = useMemo(() => !!userData?.project || ['admin', 'recruiter', 'super-admin'].includes(userData?.role as string), [userData]);

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

  const role = useMemo(() => isAuth && userData ? userData.role : undefined, [userData, isAuth]);

  return (
    <AuthContext.Provider value={{ isAuth, login, logout, userId, role, isVerified, username: `${userData?.name} ${userData?.surname}` }}>
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
    role: authContext.role,
    isVerified: authContext.isVerified,
    username: authContext.username,
  };
};

export default AuthProvider;
