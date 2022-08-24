import React, {
  createContext, ReactNode, useContext, useEffect, useMemo,
} from 'react';
import { useLocation } from 'react-router-dom';

import useLocalStorageState from 'hooks/useLocalStorageState';
import { useGetNotifications } from 'api/query/notificationsQuery';

type contextType = {
  newNotification: boolean;
};

const NotificationContext = createContext<contextType | undefined>(undefined);
NotificationContext.displayName = 'NotificationContext';

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [userId] = useLocalStorageState('userId');
  const {
    data: userNotifications = [],
    refetch: refetchNotifications,
  } = useGetNotifications({ to: userId }, { enabled: !!userId, refetchOnWindowFocus: false });
  const location = useLocation();

  const newNotification = useMemo(() => !!userNotifications.filter((item) => !item.viewed).length, [userNotifications]);

  useEffect(() => {
    if (userId) {
      refetchNotifications();
    }
  }, [location.pathname, refetchNotifications, userId]);

  return (
    <NotificationContext.Provider value={{ newNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('Notifications provider not exist');
  }

  return ctx.newNotification;
};

export default NotificationProvider;
