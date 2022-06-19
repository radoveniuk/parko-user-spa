import React, {
  createContext, ReactNode, useContext, useMemo, useState,
} from 'react';

import { useLoginMutation } from 'api/mutations/userMutation';
import { LoginDto, UserRole } from 'interfaces/users.interface';
import useLocalStorageState from 'hooks/useLocalStorageState';
import { useGetUser } from 'api/query/userQuery';
import { useGetNotifications } from 'api/query/notificationsQuery';

type contextType = {
  isAuth: boolean;
  login(data: LoginDto): Promise<boolean>;
  userId: string;
  role: UserRole | undefined;
  isNewNotifications: boolean;
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
  const { data: userData } = useGetUser(userId);
  const { data: userNotifications = [] } = useGetNotifications({ to: userId });

  const isNewNotifications = useMemo(() => !!userNotifications.filter((item) => !item.viewed).length, [userNotifications]);

  const login = async (data: LoginDto) => {
    const loginResult = await loginMutation.mutateAsync(data);
    if (loginResult) {
      setIsAuth(true);
      setUserId(loginResult._id);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, userId, role: userData?.role, isNewNotifications }}>
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

export const useAuthData = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('Auth provider not exist');
  }
  return {
    id: authContext.userId,
    role: authContext.role,
    isNewNotifications: authContext.isNewNotifications,
  };
};

export default AuthProvider;
