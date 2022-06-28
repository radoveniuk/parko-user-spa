import React, {
  createContext, ReactNode, useContext, useMemo, useState,
} from 'react';

import { useLoginMutation, useLogoutMutation } from 'api/mutations/userMutation';
import { LoginDto, UserRole } from 'interfaces/users.interface';
import useLocalStorageState from 'hooks/useLocalStorageState';
import { useGetUser } from 'api/query/userQuery';
import { useGetNotifications } from 'api/query/notificationsQuery';

type contextType = {
  isAuth: boolean;
  login(data: LoginDto): Promise<boolean>;
  logout(): void;
  userId: string;
  role: UserRole | undefined;
  isNewNotifications: boolean;
  isVerified: boolean;
};

const AuthContext = createContext<contextType | undefined>(undefined);
AuthContext.displayName = 'AuthContext';

const getCookieValue = (name: string) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '' // || true
);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(!!getCookieValue('Authorization'));
  const [userId, setUserId] = useLocalStorageState('userId');
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const { data: userData } = useGetUser(userId, { enabled: !!userId && isAuth });
  const { data: userNotifications = [] } = useGetNotifications({ to: userId }, { enabled: !!userId });

  const isNewNotifications = useMemo(() => !!userNotifications.filter((item) => !item.viewed).length, [userNotifications]);
  const isVerified = useMemo(() => !!userData?.project, [userData]);

  const login = async (data: LoginDto) => {
    const loginResult = await loginMutation.mutateAsync(data);
    if (loginResult) {
      setIsAuth(true);
      setUserId(loginResult._id);
      return true;
    }
    return false;
  };

  const logout = () => {
    logoutMutation.mutate(userData);
    setIsAuth(false);
    setUserId('');
  };

  const role = useMemo(() => isAuth && userData ? userData.role : 'user', [userData, isAuth]);

  return (
    <AuthContext.Provider value={{ isAuth, login, logout, userId, role, isNewNotifications, isVerified }}>
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
    isNewNotifications: authContext.isNewNotifications,
    isVerified: authContext.isVerified,
  };
};

export default AuthProvider;
